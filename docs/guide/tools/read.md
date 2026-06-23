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
    "maxReadLines": 1000,
    "workDir": "${global.root_dir}/workspace",
    "maxSearchResults": 30
  }
}
```

### 配置参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `workDir` | string | `.` | 工作目录，限制文件访问范围 |
| `maxReadLines` | int | 1000 | 最大读取行数 |
| `maxSearchResults` | int | 30 | 搜索结果最大数量 |

## 操作类型

### file - 读取文件

读取指定文件的内容。

**参数**：
```json
{
  "operation": "file",
  "path": "path/to/file.txt"
}
```

**可选参数**：
| 参数 | 说明 |
|------|------|
| `line_from` | 起始行号（从 1 开始） |
| `line_to` | 结束行号 |

**示例**：
```json
{
  "operation": "file",
  "path": "README.md"
}
```

读取指定行范围：
```json
{
  "operation": "file",
  "path": "large.log",
  "line_from": 100,
  "line_to": 200
}
```

### search - 搜索内容

在文件中搜索匹配的内容。

**参数**：
```json
{
  "operation": "search",
  "path": "path/to/search",
  "query": "搜索关键词"
}
```

**可选参数**：
| 参数 | 说明 |
|------|------|
| `pattern` | 文件匹配模式（默认 `*.md`） |

**示例**：
```json
{
  "operation": "search",
  "path": "src",
  "query": "func main",
  "pattern": "*.go"
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

**示例**：
```json
{
  "operation": "list",
  "path": "workspace"
}
```

## 使用示例

### 读取配置文件

```
用户: 帮我看看 config.yaml 的内容

智能体调用:
{
  "operation": "file",
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
  "query": "HelloWorld",
  "pattern": "*.go"
}
```

### 查看项目结构

```
用户: 列出项目目录结构

智能体调用:
{
  "operation": "list",
  "path": "."
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

### 行数限制

超过 `maxReadLines` 的文件会被截断，并提示用户文件过长。

### 搜索结果限制

搜索结果最多返回 `maxSearchResults` 条。

## 错误处理

| 错误 | 原因 | 解决方案 |
|------|------|----------|
| `file not found` | 文件不存在 | 检查路径是否正确 |
| `permission denied` | 无访问权限 | 检查文件权限 |
| `path outside workdir` | 路径在工作目录外 | 使用工作目录内的路径 |

## 最佳实践

### 1. 大文件分段读取

```json
// 先读取前 100 行
{"operation": "file", "path": "large.log", "line_from": 1, "line_to": 100}

// 再读取后面的内容
{"operation": "file", "path": "large.log", "line_from": 101, "line_to": 200}
```

### 2. 使用搜索定位内容

先搜索定位，再精确读取：

```json
// 1. 搜索关键词位置
{"operation": "search", "path": "src", "query": "target_function", "pattern": "*.go"}

// 2. 读取相关文件
{"operation": "file", "path": "src/found_file.go"}
```

### 3. 了解项目结构

先列出目录结构，再定位文件：

```json
{"operation": "list", "path": "."}
```

## 相关工具

- [write](/guide/tools/write) - 文件写入
- [edit](/guide/tools/edit) - 文件编辑
- [bash](/guide/tools/bash) - Shell 命令执行
