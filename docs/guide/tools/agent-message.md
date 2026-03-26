# agent-message 技能

智能体消息发送技能，用于向指定智能体发送消息并获取响应。支持多模态消息（文本、图片）、流式输出、历史消息加载。

## 概述

当需要调用其他智能体、发送图片进行分析、或进行跨智能体协作时使用此技能。

## 命令格式

```bash
tpclaw agent -m <message> -a <agent-id> [options]
```

## 参数说明

| 参数 | 短参数 | 必须 | 默认值 | 说明 |
|------|--------|------|--------|------|
| `--message` | `-m` | 是 | - | 消息内容 |
| `--agent` | `-a` | 否 | `main` | 智能体 ID |
| `--file` | `-f` | 否 | - | 从文件读取消息内容 |
| `--format` | - | 否 | `text` | 输入格式：`text` 或 `json` |
| `--stream` | - | 否 | `false` | 流式输出 |
| `--json` | - | 否 | `false` | JSON 格式输出 |
| `--history` | `-H` | 否 | `false` | 加载历史消息上下文 |

## 输入格式

### text 格式（默认）

纯文本消息，CLI 自动转换为 OpenAI 格式：

```bash
tpclaw agent -a main -m "你好，请帮我分析这段代码"
```

### json 格式

OpenAI 协议格式，用于多模态消息（包含图片）：

```bash
tpclaw agent -a main --format json -m '{"messages":[{"role":"user","content":[{"type":"text","text":"分析这张图片"},{"type":"image_url","image_url":{"url":"/path/to/image.jpg"}}]}]}'
```

**注意：** 使用 `--format json` 时，JSON 必须是有效的 OpenAI 消息格式。

## 历史消息加载

`--history` 参数用于保持对话上下文连续性。

### 使用场景

- **截图分析后续处理**：调用工具截图后，如需基于之前的分析继续对话
- **多轮任务协作**：需要在同一会话中完成多个相关步骤
- **上下文延续**：新消息需要参考之前对话中的信息

### 示例

```bash
# 加载历史消息上下文继续对话
tpclaw agent -m "继续上次的任务" -a main --history
```

## 多模态消息

支持 OpenAI 标准的多模态消息格式。

### 支持的图片格式

| 格式 | 说明 |
|------|------|
| 本地路径 | `/tmp/images/photo.png` 或 `file:///tmp/images/photo.png` |
| URL | `https://example.com/image.png` |
| Base64 | `data:image/png;base64,iVBORw0KGgo...` |

### 发送图片示例

```bash
# 使用 --format json 发送多模态消息（JSON 必须压缩为单行）
tpclaw agent -a main --format json -m '{"messages":[{"role":"user","content":[{"type":"text","text":"请分析这张图片"},{"type":"image_url","image_url":{"url":"/tmp/snapshot_xxx.jpg"}}]}]}'
```

### JSON 格式说明

正确的 OpenAI 消息格式：

```json
{
  "messages": [
    {
      "role": "user",
      "content": [
        {"type": "text", "text": "你的问题"},
        {"type": "image_url", "image_url": {"url": "/path/to/image.jpg"}}
      ]
    }
  ]
}
```

**重要提示：**

- 命令行中 JSON 必须压缩为单行
- 使用单引号包裹 JSON，避免 shell 转义问题
- 图片路径使用 `image_url` 类型

## 使用示例

### 基本使用

```bash
# 向默认智能体发送文本消息
tpclaw agent -a main -m "你好，请帮我分析这段代码"

# 向指定智能体发送消息
tpclaw agent -m "生成一份周报" -a report-agent

# 从文件读取消息
tpclaw agent -f ./task.txt -a main
```

### 智能体协作

```bash
# 让主智能体调用其他智能体
tpclaw agent -m "请调用 code-reviewer 智能体审查 ./src/utils.go 文件" -a main

# 向翻译智能体发送任务
tpclaw agent -m "翻译这段文字到英文" -a translator
```

### 图片分析

```bash
# 发送图片进行分析
tpclaw agent -a main --format json -m '{"messages":[{"role":"user","content":[{"type":"text","text":"分析这张截图"},{"type":"image_url","image_url":{"url":"/tmp/screenshot.png"}}]}]}'
```

## 模型视觉能力

| 模型系列 | 视觉支持 |
|----------|----------|
| GPT-4o, GPT-4-turbo, GPT-4-vision | 支持 |
| Claude-3, Claude-4 | 支持 |
| GLM-4V, GLM-4.6V | 支持 |
| Qwen-VL, Qwen2-VL, Qwen2.5-VL | 支持 |
| Gemini, DeepSeek | 支持 |
| GPT-4, GPT-3.5, GLM-4 | 不支持 |

## 错误处理

| 错误 | 解决方案 |
|------|----------|
| `Agent not found` | 使用 `tpclaw agents list` 查看可用智能体 |
| `Failed to load image` | 检查图片路径和格式 |
| `JSON 格式无效` | 检查 JSON 格式是否正确，确保压缩为单行 |
| `Request timeout` | 检查网络连接或使用默认非流式模式 |

## 最佳实践

### 1. 选择合适的智能体

根据任务类型选择专门的智能体：

```bash
# 代码审查
tpclaw agent -m "审查代码" -a code-reviewer

# 文档生成
tpclaw agent -m "生成文档" -a doc-writer

# 数据分析
tpclaw agent -m "分析数据" -a data-analyst
```

### 2. 合理使用历史消息

需要上下文时使用 `--history`：

```bash
# 首次对话
tpclaw agent -m "分析这个文件" -a main

# 继续对话（保持上下文）
tpclaw agent -m "继续深入分析" -a main --history
```

### 3. 图片大小控制

建议图片小于 500KB，以提高处理效率。

## 相关文档

- [智能体配置](/guide/configuration/agents) - 智能体配置说明
- [多智能体协作](/guide/advanced/multi-agent) - 多智能体协作
- [CLI 命令参考](/guide/api/cli) - 完整 CLI 命令