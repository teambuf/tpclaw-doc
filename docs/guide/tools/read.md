# read - 文件读取工具

读取文件内容、搜索文件内容、列出目录结构。

## 概述

`read` 工具是 TPCLAW 最基础的文件操作工具，让智能体能够：
- 读取文件内容
- 搜索文件中的特定内容
- 列出目录结构
- 获取文件元信息

## 配置

```json
{
  "type": "builtin",
  "name": "read",
  "description": "读取文件内容、搜索内容、列出目录",
  "config": {
    "maxReadLines": 2000,
    "workDir": "${global.root_dir}/workspace"
  }
}
```

### 配置参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `workDir` | string | - | 工作目录，限制文件访问范围 |
| `maxReadLines` | int | 2000 | 最大读取行数 |
| `maxFileSize` | int | 10MB | 最大文件大小 |

## 操作类型

### read - 读取文件

读取指定文件的内容。

**参数**：
```json
{
  "operation": "read",
  "path": "path/to/file.txt"
}
```

**可选参数**：
| 参数 | 说明 |
|------|------|
| `offset` | 起始行号（从 0 开始） |
| `limit` | 读取行数 |
| `encoding` | 文件编码（默认 utf-8） |

**示例**：
```json
{
  "operation": "read",
  "path": "README.md"
}
```

### search - 搜索内容

在文件中搜索匹配的内容。

**参数**：
```json
{
  "operation": "search",
  "path": "path/to/search",
  "pattern": "搜索关键词"
}
```

**可选参数**：
| 参数 | 说明 |
|------|------|
| `recursive` | 是否递归搜索子目录 |
| `filePattern` | 文件匹配模式（如 `*.go`） |
| `ignoreCase` | 是否忽略大小写 |

**示例**：
```json
{
  "operation": "search",
  "path": "src",
  "pattern": "func main",
  "recursive": true,
  "filePattern": "*.go"
}
```

### list - 列出目录

列出目录内容。

**参数**：
```json
{
  "operation": "list",
  "path": "path/to/directory"
}
```

**可选参数**：
| 参数 | 说明 |
|------|------|
| `recursive` | 是否递归列出子目录 |
| `depth` | 递归深度 |
| `showHidden` | 是否显示隐藏文件 |

**示例**：
```json
{
  "operation": "list",
  "path": "workspace",
  "recursive": true,
  "depth": 2
}
```

### info - 文件信息

获取文件的元信息。

**参数**：
```json
{
  "operation": "info",
  "path": "path/to/file"
}
```

**返回信息**：
- 文件大小
- 创建时间
- 修改时间
- 文件权限
- 文件类型

## 使用示例

### 读取配置文件

```
用户: 帮我看看 config.yaml 的内容

智能体调用:
{
  "operation": "read",
  "path": "config.yaml"
}
```

### 搜索代码

```
用户: 找一下所有包含 "HelloWorld" 的 Go 文件

智能体调用:
{
  "operation": "search",
  "path": ".",
  "pattern": "HelloWorld",
  "recursive": true,
  "filePattern": "*.go"
}
```

### 查看项目结构

```
用户: 列出项目目录结构

智能体调用:
{
  "operation": "list",
  "path": ".",
  "recursive": true,
  "depth": 3
}
```

## 安全限制

### 工作目录限制

只能访问 `workDir` 配置的目录及其子目录：

```json
{
  "config": {
    "workDir": "${global.root_dir}/workspace"
  }
}
```

尝试访问工作目录外的文件会被拒绝。

### 文件大小限制

超过 `maxFileSize` 的文件会被截断或拒绝。

### 行数限制

超过 `maxReadLines` 的文件会被截断，并提示用户文件过长。

## 错误处理

| 错误 | 原因 | 解决方案 |
|------|------|----------|
| `file not found` | 文件不存在 | 检查路径是否正确 |
| `permission denied` | 无访问权限 | 检查文件权限 |
| `path outside workdir` | 路径在工作目录外 | 使用工作目录内的路径 |
| `file too large` | 文件超过大小限制 | 使用 offset/limit 分段读取 |

## 最佳实践

### 1. 大文件分段读取

```json
// 先读取前 100 行
{"operation": "read", "path": "large.log", "offset": 0, "limit": 100}

// 再读取后面的内容
{"operation": "read", "path": "large.log", "offset": 100, "limit": 100}
```

### 2. 使用搜索定位内容

先搜索定位，再精确读取：

```json
// 1. 搜索关键词位置
{"operation": "search", "path": "src", "pattern": "target_function"}

// 2. 读取相关文件
{"operation": "read", "path": "src/found_file.go"}
```

### 3. 了解项目结构

先列出目录结构，再定位文件：

```json
{"operation": "list", "path": ".", "recursive": true, "depth": 2}
```

## 相关工具

- [write](/guide/tools/write) - 文件写入
- [edit](/guide/tools/edit) - 文件编辑
- [bash](/guide/tools/bash) - Shell 命令执行
