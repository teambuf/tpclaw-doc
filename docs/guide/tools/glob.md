# glob - 文件名匹配工具

按 glob 模式匹配文件路径（如 `**/*.go`），快速定位文件。ripgrep 优先、纯 Go 兜底。

## 概述

`glob` 工具让智能体按文件名模式查找文件：

- 支持 `**` 跨层递归（`**/*.go` 匹配任意层级）
- 可按修改时间排序
- 限制返回数量

## 配置

```json
{
  "type": "builtin",
  "name": "glob",
  "description": "文件名匹配（**/*.go）",
  "config": {
    "workDir": "${global.root_dir}/workspace"
  }
}
```

### 配置参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `workDir` | string | `.` | 匹配的工作目录 |
| `maxResults` | int | | 单次最大文件数 |
| `hardMaxLimit` | int | | 硬上限 |

## 调用参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `pattern` | string | 是 | glob 模式（如 `**/*.go`、`src/*.ts`） |
| `path` | string | 否 | 搜索路径（默认 workDir） |
| `head_limit` | int | 否 | 限制返回数量 |

## 使用示例

### 找所有 Go 文件

```json
{ "pattern": "**/*.go" }
```

### 找某目录下的配置文件

```json
{ "pattern": "config/*.yaml" }
```

## 安全限制

- 只能匹配 `workDir` 及 `allowDirs` 允许的目录内文件。
- 输出经统一截断，防止上下文爆炸。

## 相关工具

- [grep](/guide/tools/grep) - 内容搜索
- [read](/guide/tools/read) - 读取文件内容
