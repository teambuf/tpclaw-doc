# TOOLS.md 工具使用说明

TOOLS.md 记录了智能体可用的工具使用说明和最佳实践。

## 概述

TOOLS.md 是智能体的工具参考手册，帮助智能体正确、高效地使用各种工具。

## 文件位置

```
workspace/
└── TOOLS.md
```

## 文件内容示例

```markdown
# 工具使用说明

## 文件操作工具

### read - 读取文件

用于读取文件内容。

**使用场景：**
- 查看配置文件
- 读取代码文件
- 检查日志内容

**最佳实践：**
- 大文件使用 `limit` 参数限制行数
- 指定正确的编码格式

**示例：**
```
read("config.yaml")
read("large_file.log", limit=100)
```

### write - 写入文件

用于创建或覆盖文件。

**使用场景：**
- 创建新文件
- 更新配置
- 保存输出结果

**最佳实践：**
- 写入前确认文件路径
- 重要文件先备份

**示例：**
```
write("output.txt", "Hello World")
```

### edit - 编辑文件

用于精确修改文件内容。

**使用场景：**
- 修改代码
- 更新配置项
- 修复文件内容

**最佳实践：**
- 提供足够的上下文
- 确保匹配内容唯一

**示例：**
```
edit("config.yaml", "port: 8080", "port: 9090")
```

## 执行工具

### bash - 执行命令

用于执行 Shell 命令。

**使用场景：**
- 运行脚本
- 系统操作
- 安装依赖

**最佳实践：**
- 检查命令安全性
- 设置合理的超时时间
- 避免交互式命令

**示例：**
```
bash("ls -la")
bash("npm install", timeout=60)
```

## 技能工具

### skill - 调用技能

用于调用预定义的技能脚本。

**使用场景：**
- 执行复杂任务
- 复用工作流程
- 调用外部服务

**可用技能：**
- cron-task: 定时任务管理
- feishu-api: 飞书 API 调用
- message-send: 消息发送

**示例：**
```
skill("feishu-api", action="send_message", chat_id="oc_xxx", content="Hello")
```

## 浏览器工具

### browser_use - 浏览器自动化

用于控制浏览器执行操作。

**使用场景：**
- 网页抓取
- 自动化测试
- 表单填写

**最佳实践：**
- 使用 headless 模式提高效率
- 设置合理的等待时间
- 处理弹窗和验证

**示例：**
```
browser_use("go_to_url", url="https://example.com")
browser_use("click", selector="#submit-button")
browser_use("input", selector="#search", text="query")
```

## 搜索工具

### search - 网络搜索

用于搜索互联网信息。

**使用场景：**
- 查找资料
- 获取最新信息
- 验证事实

**最佳实践：**
- 使用具体的关键词
- 验证信息来源
- 结合浏览器工具查看详情

## 工具选择指南

| 任务类型 | 推荐工具 |
|---------|---------|
| 文件读取 | read |
| 文件创建 | write |
| 文件修改 | edit |
| 命令执行 | bash |
| 复杂任务 | skill |
| 网页操作 | browser_use |
| 信息搜索 | search |

## 安全注意事项

1. **文件操作**：避免操作系统关键文件
2. **命令执行**：检查命令安全性，避免危险操作
3. **网络请求**：注意隐私保护，不泄露敏感信息
4. **权限控制**：遵守工作目录限制
```

## 工具分类

### 文件操作

| 工具 | 说明 |
|------|------|
| `read` | 读取文件内容 |
| `write` | 写入文件 |
| `edit` | 编辑文件 |

### 执行工具

| 工具 | 说明 |
|------|------|
| `bash` | 执行 Shell 命令 |
| `skill` | 调用技能 |

### 网络工具

| 工具 | 说明 |
|------|------|
| `browser_use` | 浏览器自动化 |
| `search` | 网络搜索 |

### MCP 工具

| 工具 | 说明 |
|------|------|
| `mcp` | MCP 协议工具 |

## 在智能体中引用

TOOLS.md 通常在系统提示词中引用：

```json
{
  "systemPrompt": "${include(global.root_dir+'/workspace/TOOLS.md')}"
}
```

## 相关文档

- [工具系统](/guide/tools/read) - 工具详细说明
- [技能系统](/guide/tools/skill) - 技能配置
- [工作空间结构](/guide/workspace/structure) - 工作空间概览