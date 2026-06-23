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
    "workDir": "${global.root_dir}/workspace",
    "maxFileSize": 10485760
  }
}
```

### 配置参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `workDir` | string | `.` | 工作目录，限制文件访问范围 |
| `maxFileSize` | int | 10485760 (10MB) | 单次写入最大字节数，0 表示不限制 |

## 操作类型

### file - 写入文件

写入内容到文件，通过 `mode` 参数指定写入模式。

**参数**：
```json
{
  "operation": "file",
  "path": "path/to/file.txt",
  "content": "文件内容",
  "mode": "create"
}
```

**写入模式**：
| mode | 说明 |
|------|------|
| `create` | 创建新文件，如果文件已存在则报错（默认） |
| `overwrite` | 覆盖现有文件 |
| `append` | 追加内容到文件末尾 |

**示例 - 创建新文件**：
```json
{
  "operation": "file",
  "path": "hello.txt",
  "content": "Hello, World!",
  "mode": "create"
}
```

**示例 - 覆盖文件**：
```json
{
  "operation": "file",
  "path": "hello.txt",
  "content": "New content",
  "mode": "overwrite"
}
```

**示例 - 追加内容**：
```json
{
  "operation": "file",
  "path": "log.txt",
  "content": "\n2024-01-15: 新的日志条目",
  "mode": "append"
}
```

## 使用示例

### 创建新文件

```
用户: 创建一个 README.md 文件

智能体调用:
{
  "operation": "file",
  "path": "README.md",
  "content": "# 项目名称\n\n项目描述...",
  "mode": "create"
}
```

### 追加日志

```
用户: 记录一条日志

智能体调用:
{
  "operation": "file",
  "path": "workspace/log.md",
  "content": "\n## 2024-01-15\n完成了文档编写任务",
  "mode": "append"
}
```

### 覆盖文件

```
用户: 更新配置文件

智能体调用:
{
  "operation": "file",
  "path": "config.yaml",
  "content": "server:\n  port: 8080",
  "mode": "overwrite"
}
```

## 安全限制

### 工作目录限制

只能写入 `workDir` 配置的目录及其子目录。

### 文件大小限制

单次写入内容不能超过 `maxFileSize` 配置的大小（默认 10MB）。

## 错误处理

| 错误 | 原因 | 解决方案 |
|------|------|----------|
| `path outside workdir` | 路径在工作目录外 | 使用工作目录内的路径 |
| `file already exists` | create 模式时文件已存在 | 使用 overwrite 模式覆盖 |
| `content too large` | 内容超过大小限制 | 减小写入内容或调整 maxFileSize |
| `permission denied` | 无写入权限 | 检查文件权限 |

## 最佳实践

### 1. 重要文件先备份

在覆盖重要文件前，先读取确认内容：

```json
// 1. 先读取确认
{"operation": "file", "path": "important.md"}

// 2. 确认后再写入
{"operation": "file", "path": "important.md", "content": "新内容", "mode": "overwrite"}
```

### 2. 使用追加模式记录日志

```json
{
  "operation": "file",
  "path": "MEMORY.md",
  "content": "\n## 2024-01-15\n今天学习了新技能...",
  "mode": "append"
}
```

### 3. 使用原子写入

write 工具使用原子写入（先写入临时文件再重命名），确保写入过程中断不会损坏原有文件。

## 相关工具

- [read](/guide/tools/read) - 文件读取
- [edit](/guide/tools/edit) - 文件编辑
- [bash](/guide/tools/bash) - Shell 命令执行
