# 工具安全与文件访问控制

TPCLAW 对智能体的工具行为做了两层约束，统一通过 `toolSecurity` 配置管理：

1. **工具与命令级** —— 决定智能体能使用哪些工具、能执行哪些命令。
2. **文件路径级** —— 决定智能体能访问哪些目录（即跨目录访问防护）。

本页是这两层控制的权威说明。用户认证、限流、密钥管理属于另一范畴，见[认证配置](/guide/configuration/security)。

## 防护层级总览

| 层级 | 作用 | 关键配置项 | 生效范围 |
|------|------|-----------|---------|
| 工具级 | 启用 / 禁用整个工具 | `denyTools` / `allowTools` / `deniedTypes` | 所有工具 |
| 命令级 | bash 命令黑名单 | `cmdDenyExtra` | bash |
| 路径级 | 文件路径白 / 黑名单 | `allowPaths` / `denyPaths` | read / write / edit |
| 工作目录级 | 限定文件访问根目录 | `workDir` / `allowDirs` | 文件类工具各自 `config` |

::: tip 两类配置的关系
工具级、命令级、路径级三档写在 `agents.defaults.toolSecurity`（全局默认，也可在单个智能体定义中覆盖）；工作目录级写在各工具的 `config` 里。两者配合使用——前者是「能不能用这个工具」，后者是「这个工具能碰哪些文件」。
:::

## 一、工具拦截策略

通过 `agents.defaults.toolSecurity` 控制智能体可使用的工具范围。**默认关闭**（`enable: false`）。

### 黑名单模式（deny，默认）

命中黑名单的工具被拦截，其余放行：

```yaml
agents:
  defaults:
    toolSecurity:
      enable: true
      mode: "deny"
      denyTools: "bash,edit"           # 拦截 bash 和 edit 工具
      deniedTypes: "mcp"               # 拦截所有 MCP 工具
      cmdDenyExtra: "rm,sudo"          # bash 工具额外禁止 rm 和 sudo
      denyPaths: "/etc,/var"           # 禁止访问 /etc 和 /var 目录
```

### 白名单模式（allow）

仅白名单内的工具放行，其余全部拦截（更严格，适合生产）：

```yaml
agents:
  defaults:
    toolSecurity:
      enable: true
      mode: "allow"
      allowTools: "read,skill"         # 只允许 read 和 skill 工具
      allowPaths: "/data/workspace"    # 只允许访问工作空间目录
```

### 配置项说明

| 配置项 | 说明 |
|-------|------|
| `enable` | 是否启用，默认 `false` |
| `mode` | `deny`（黑名单）或 `allow`（白名单） |
| `denyTools` | 黑名单模式下拦截的工具名称，逗号分隔，支持 `*` 通配符（如 `bash*`） |
| `allowTools` | 白名单模式下允许的工具名称，逗号分隔，支持 `*` 通配符 |
| `deniedTypes` | 拦截的工具类型：`builtin`、`mcp`、`rulechain`、`subagent` |
| `cmdDenyExtra` | bash 工具额外命令黑名单，在工具自身安全检查之上追加 |
| `allowPaths` | 文件路径白名单（read/write/edit 工具），为空不限制 |
| `denyPaths` | 文件路径黑名单，优先级高于 `allowPaths` |

::: tip 通配符
`denyTools` / `allowTools` 支持 `*` 通配：`bash*` 匹配 `bash`、`bash_run` 等所有以 `bash` 开头的工具。
:::

## 二、文件访问控制（跨目录）

文件路径级防护决定智能体能读写哪些目录，由两条机制叠加：全局的 `allowPaths` / `denyPaths`，以及各工具自身的 `workDir` / `allowDirs`。

### 路径白 / 黑名单：allowPaths / denyPaths

写在 `toolSecurity` 中，作用于 read / write / edit：

- `allowPaths`：白名单，只允许访问列表内路径，为空则不限制。
- `denyPaths`：黑名单，**优先级高于 `allowPaths`**——即使路径在白名单内，命中黑名单同样拒绝。

### 工作目录限定：workDir

每个文件类工具在自身 `config` 中声明 `workDir`，将其访问范围限定在该目录及其子目录内。尝试访问工作目录外的文件会被直接拒绝，并返回 `path outside workdir` 错误。

```json
{
  "type": "builtin",
  "name": "read",
  "config": {
    "workDir": "${global.root_dir}/workspace"
  }
}
```

### 多根访问：allowDirs

`grep`、`glob` 等工具可在 `config` 中额外声明 `allowDirs`，授权访问 `workDir` 之外的指定目录。即「只能访问 `workDir` 及 `allowDirs` 允许的目录，越界拒绝」。

### 各文件工具防护汇总

| 工具 | workDir | allowDirs | 越界行为 |
|------|:-------:|:---------:|---------|
| [read](/guide/tools/read) | ✓ | — | 拒绝，报 `path outside workdir` |
| [write](/guide/tools/write) | ✓ | — | 拒绝，报 `path outside workdir` |
| [edit](/guide/tools/edit) | ✓ | — | 拒绝，报 `path outside workdir` |
| [grep](/guide/tools/grep) | ✓ | ✓ | 越界拒绝 |
| [glob](/guide/tools/glob) | ✓ | ✓ | 越界拒绝 |
| [bash](/guide/tools/bash) | ✓（作为命令工作目录） | — | 命令黑白名单 + 超时控制（见下节） |

## 三、bash 命令安全

bash 工具风险最高（可执行任意系统命令），通过三层约束：

1. **命令黑白名单**：`config.mode`（`deny` 黑名单 / `allow` 白名单）+ `config.allowList` / `config.denyList`。
2. **追加黑名单**：`toolSecurity.cmdDenyExtra`，在工具自身检查之上再追加禁用命令。
3. **超时保护**：`config.timeout`（秒），超时自动终止。

### 危险命令

以下命令应谨慎使用或在 `denyList` / `cmdDenyExtra` 中禁止：

| 命令 | 风险 |
|------|------|
| `rm -rf /` | 删除整个系统 |
| `sudo` | 提权操作 |
| `chmod 777` | 不安全的权限设置 |
| `dd` | 磁盘操作 |
| `mkfs` | 格式化磁盘 |
| `:(){ :\|:& };:` | Fork 炸弹 |

## 四、配置示例

生产环境推荐使用白名单模式，最小授权：

```yaml
agents:
  defaults:
    toolSecurity:
      enable: true
      mode: "allow"
      allowTools: "read,write,edit,grep,glob,skill"  # 仅放行必要工具，禁用 bash
      allowPaths: "/data/workspace"                   # 限定文件访问范围
      # 即便放行 bash，也强制禁用危险命令：
      # cmdDenyExtra: "rm -rf,sudo,chmod 777,dd,mkfs"
```

各文件工具的 `workDir` 统一指向工作空间根目录：

```json
{
  "type": "builtin",
  "name": "read",
  "config": { "workDir": "${global.root_dir}/workspace" }
}
```

## 五、相关文档

- [智能体配置](/guide/configuration/agents) - `toolSecurity` 所在的配置层级
- [配置文件](/guide/configuration/config-file) - 全局配置项参考
- [read](/guide/tools/read) / [write](/guide/tools/write) / [edit](/guide/tools/edit) / [grep](/guide/tools/grep) / [glob](/guide/tools/glob) / [bash](/guide/tools/bash) - 各工具的安全限制
- [认证配置](/guide/configuration/security) - 用户认证、限流、密钥管理（区别于本页）
