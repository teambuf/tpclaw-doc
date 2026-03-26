# write - 文件写入工具

写入内容到文件，支持创建、覆盖和追加模式。

## 概述

`write` 工具让智能体能够：
- 创建新文件
- 覆盖现有文件
- 追加内容到文件末尾

## 配置

```json
{
  "type": "builtin",
  "name": "write",
  "description": "写入内容到文件",
  "config": {
    "workDir": "${global.root_dir}/workspace"
  }
}
```

### 配置参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `workDir` | string | - | 工作目录，限制文件访问范围 |
| `createDirs` | bool | true | 自动创建父目录 |
| `backup` | bool | true | 覆盖前是否备份 |

## 操作类型

### write - 写入/覆盖文件

写入内容到文件，如果文件存在则覆盖。

**参数**：
```json
{
  "operation": "write",
  "path": "path/to/file.txt",
  "content": "文件内容"
}
```

**示例**：
```json
{
  "operation": "write",
  "path": "hello.txt",
  "content": "Hello, World!"
}
```

### append - 追加内容

追加内容到文件末尾，如果文件不存在则创建。

**参数**：
```json
{
  "operation": "append",
  "path": "path/to/file.txt",
  "content": "追加的内容"
}
```

**示例**：
```json
{
  "operation": "append",
  "path": "log.txt",
  "content": "\n2024-01-15: 新的日志条目"
}
```

### create - 创建文件

创建空文件，如果文件已存在则报错。

**参数**：
```json
{
  "operation": "create",
  "path": "path/to/newfile.txt"
}
```

## 使用示例

### 创建新文件

```
用户: 创建一个 README.md 文件

智能体调用:
{
  "operation": "write",
  "path": "README.md",
  "content": "# 项目名称\n\n项目描述..."
}
```

### 追加日志

```
用户: 记录一条日志

智能体调用:
{
  "operation": "append",
  "path": "workspace/log.md",
  "content": "\n## 2024-01-15\n完成了文档编写任务"
}
```

### 创建目录结构

```
用户: 创建 src/components 目录结构

智能体调用:
{
  "operation": "write",
  "path": "src/components/.gitkeep",
  "content": ""
}
```

## 安全限制

### 工作目录限制

只能写入 `workDir` 配置的目录及其子目录。

### 文件类型限制

可以在配置中限制允许写入的文件类型：

```json
{
  "config": {
    "workDir": "${global.root_dir}/workspace",
    "allowedExtensions": [".md", ".txt", ".json", ".yaml"]
  }
}
```

### 备份机制

启用备份时，覆盖文件前会自动创建备份：

```
原文件: document.md
备份: document.md.bak.20240115103000
```

## 错误处理

| 错误 | 原因 | 解决方案 |
|------|------|----------|
| `path outside workdir` | 路径在工作目录外 | 使用工作目录内的路径 |
| `file already exists` | create 时文件已存在 | 使用 write 操作覆盖 |
| `directory not found` | 父目录不存在 | 启用 createDirs 或先创建目录 |
| `permission denied` | 无写入权限 | 检查文件权限 |

## 最佳实践

### 1. 重要文件先备份

在覆盖重要文件前，先读取确认内容：

```json
// 1. 先读取确认
{"operation": "read", "path": "important.md"}

// 2. 确认后再写入
{"operation": "write", "path": "important.md", "content": "新内容"}
```

### 2. 使用追加模式记录日志

```json
{
  "operation": "append",
  "path": "MEMORY.md",
  "content": "\n## 2024-01-15\n今天学习了新技能..."
}
```

### 3. 创建目录时添加 .gitkeep

```json
{
  "operation": "write",
  "path": "new/directory/.gitkeep",
  "content": ""
}
```

## 相关工具

- [read](/guide/tools/read) - 文件读取
- [edit](/guide/tools/edit) - 文件编辑
- [bash](/guide/tools/bash) - Shell 命令执行
