# edit - 文件编辑工具

提供行级编辑、搜索替换、插入和删除操作，支持备份和恢复。

## 概述

`edit` 工具让智能体能够：
- 替换文件中的特定内容
- 在指定行插入新内容
- 删除指定的行
- 撤销最近的编辑

## 配置

```json
{
  "type": "builtin",
  "name": "edit",
  "description": "编辑文件，支持搜索替换、插入删除",
  "config": {
    "workDir": "${global.root_dir}/workspace",
    "maxHistory": 10
  }
}
```

### 配置参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `workDir` | string | - | 工作目录 |
| `maxHistory` | int | 10 | 最大历史版本数 |

## 操作类型

### line - 编辑行

编辑指定行的内容。

**参数**：
```json
{
  "operation": "line",
  "path": "path/to/file.txt",
  "line_number": 10,
  "new_content": "新的内容"
}
```

**示例**：
```json
{
  "operation": "line",
  "path": "main.go",
  "line_number": 15,
  "new_content": "fmt.Println(\"Hello, World!\")"
}
```

### search - 搜索替换

搜索并替换文件中的内容。

**参数**：
```json
{
  "operation": "search",
  "path": "path/to/file.txt",
  "search": "要搜索的内容",
  "replace": "替换后的内容"
}
```

**可选参数**：
| 参数 | 说明 |
|------|------|
| `global` | 替换所有匹配项（默认只替换第一个） |
| `use_regex` | 使用正则表达式 |

**示例**：
```json
{
  "operation": "search",
  "path": "config.yaml",
  "search": "old_value",
  "replace": "new_value",
  "global": true
}
```

### insert - 插入内容

在指定位置插入新内容。

**参数**：
```json
{
  "operation": "insert",
  "path": "path/to/file.txt",
  "new_content": "要插入的内容",
  "insert_after": "匹配内容"
}
```

**插入方式**：
| 参数 | 说明 |
|------|------|
| `insert_after` | 在匹配内容之后插入 |
| `insert_before` | 在匹配内容之前插入 |

**示例**：
```json
{
  "operation": "insert",
  "path": "README.md",
  "insert_after": "## 安装",
  "new_content": "\n### 环境要求\n- Go 1.24+"
}
```

### delete - 删除行

删除指定的行。

**参数**：
```json
{
  "operation": "delete",
  "path": "path/to/file.txt",
  "delete_lines": [5, 6, 7]
}
```

**示例**：
```json
{
  "operation": "delete",
  "path": "temp.txt",
  "delete_lines": [1, 2, 3]
}
```

### restore - 恢复备份

从备份恢复文件。

**参数**：
```json
{
  "operation": "restore",
  "path": "path/to/file.txt",
  "version": 1
}
```

### list_backups - 列出备份

列出文件的所有备份版本。

**参数**：
```json
{
  "operation": "list_backups",
  "path": "path/to/file.txt"
}
```

## 使用示例

### 修改配置值

```
用户: 把 config.yaml 里的 port 改成 8080

智能体调用:
{
  "operation": "search",
  "path": "config.yaml",
  "search": "port: 9527",
  "replace": "port: 8080"
}
```

### 在指定位置插入代码

```
用户: 在 main 函数后面添加一个新函数

智能体调用:
{
  "operation": "insert",
  "path": "main.go",
  "insert_after": "func main()",
  "new_content": "\nfunc newFunction() {\n    // 新函数\n}"
}
```

### 删除指定行

```
用户: 删除第 5 到 7 行

智能体调用:
{
  "operation": "delete",
  "path": "code.go",
  "delete_lines": [5, 6, 7]
}
```

### 恢复备份

```
用户: 恢复到上一个版本

智能体调用:
{
  "operation": "restore",
  "path": "config.yaml",
  "version": 1
}
```

## 备份机制

### 自动备份

每次编辑前自动创建备份：

```
原文件: document.md
备份: document.md.bak.1
备份: document.md.bak.2
...
```

### 备份管理

```bash
# 查看备份列表
ls -la document.md.bak.*

# 恢复到指定备份
cp document.md.bak.2 document.md
```

## 正则表达式

`edit` 工具支持使用正则表达式进行高级搜索替换：

### 正则替换示例

```json
{
  "operation": "search",
  "path": "data.txt",
  "search": "\\b\\d{4}-\\d{2}-\\d{2}\\b",
  "replace": "DATE",
  "use_regex": true,
  "global": true
}
```

### 常用正则模式

| 模式 | 说明 |
|------|------|
| `^` | 行首 |
| `$` | 行尾 |
| `\\b` | 单词边界 |
| `\\d+` | 数字 |
| `\\w+` | 单词字符 |
| `.*` | 任意字符 |

## 安全限制

### 工作目录限制

只能编辑 `workDir` 配置的目录及其子目录中的文件。

### 历史版本限制

超过 `maxHistory` 的旧版本会被自动删除。

### 二进制文件保护

默认不允许编辑二进制文件。

## 错误处理

| 错误 | 原因 | 解决方案 |
|------|------|----------|
| `pattern not found` | 搜索内容不存在 | 检查搜索内容是否正确 |
| `line out of range` | 行号超出范围 | 检查文件行数 |
| `no backup available` | 没有可用的备份 | 确认备份功能已启用 |
| `binary file` | 尝试编辑二进制文件 | 仅编辑文本文件 |

## 最佳实践

### 1. 精确匹配

使用足够精确的搜索内容，避免误替换：

```json
// 不推荐 - 可能误替换
{"search": "port", "replace": "8080"}

// 推荐 - 精确匹配
{"search": "port: 9527", "replace": "port: 8080"}
```

### 2. 先读取再编辑

编辑前先读取文件，了解当前内容：

```json
// 1. 读取文件
{"operation": "file", "path": "config.yaml"}

// 2. 确认后再编辑
{"operation": "search", "path": "config.yaml", ...}
```

### 3. 使用版本控制

重要文件建议使用 Git 管理：

```bash
git add document.md
git commit -m "更新文档"
```

## 相关工具

- [read](/guide/tools/read) - 文件读取
- [write](/guide/tools/write) - 文件写入
- [bash](/guide/tools/bash) - Shell 命令执行
