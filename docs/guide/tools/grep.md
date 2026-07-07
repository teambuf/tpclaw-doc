# grep - 内容搜索工具

按正则搜索文件内容，支持上下文行、文件过滤与多种输出模式。ripgrep 优先、纯 Go 兜底（系统未装 `rg` 时自动降级，功能不缺失）。

## 概述

`grep` 工具让智能体在代码库中快速定位内容：

- 正则搜索文件内容（带行号）
- 上下文行（`-A`/`-B`/`-C`）
- 文件名过滤（`include`/`exclude`）
- 三种输出模式：匹配内容 / 仅文件名 / 计数

## 配置

```json
{
  "type": "builtin",
  "name": "grep",
  "description": "内容搜索（正则+行号+上下文+output_mode）",
  "config": {
    "workDir": "${global.root_dir}/workspace"
  }
}
```

### 配置参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `workDir` | string | `.` | 搜索的工作目录，限制访问范围 |
| `maxResults` | int | | 单次最大匹配数（head_limit 默认值） |
| `hardMaxLimit` | int | | head_limit 的硬上限 |

## 调用参数

智能体调用时传：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `pattern` | string | 是 | 正则表达式 |
| `path` | string | 否 | 搜索路径（默认 workDir） |
| `include` | string | 否 | 包含的文件模式（如 `*.go`） |
| `exclude` | string | 否 | 排除的文件模式 |
| `output_mode` | string | 否 | `content`（默认）/ `files_with_matches` / `count` |
| `-A` | int | 否 | 匹配行后追加的上下文行数 |
| `-B` | int | 否 | 匹配行前追加的上下文行数 |
| `-C` | int | 否 | 前后都追加（覆盖 -A/-B） |
| `head_limit` | int | 否 | 限制返回条数 |

## 使用示例

### 搜索函数定义

```json
{ "pattern": "func main", "include": "*.go" }
```

### 带上下文查看调用

```json
{ "pattern": "handleError", "include": "*.go", "-C": 3 }
```

### 只看哪些文件命中

```json
{ "pattern": "TODO", "output_mode": "files_with_matches" }
```

### 统计每个文件命中次数

```json
{ "pattern": "import", "output_mode": "count" }
```

## 安全限制

- 只能搜索 `workDir` 及 `allowDirs` 允许的目录，越界拒绝。
- 输出经统一截断（错误感知 head+tail），超长自动落盘到工作区，防止上下文爆炸。

## 相关工具

- [glob](/guide/tools/glob) - 文件名匹配
- [read](/guide/tools/read) - 读取文件内容
- [edit](/guide/tools/edit) - 文件编辑
