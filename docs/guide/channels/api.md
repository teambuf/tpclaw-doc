# API 通道

API 通道用于外部系统通过 REST API 调用智能体。

## 概述

API 通道提供了一种标准化的方式，让外部系统可以通过 API Key 认证调用智能体。适用于：

- 第三方系统集成
- Web 应用后端
- 移动应用后端
- 自动化脚本

## 配置

### YAML 配置

```yaml
channels:
  api:
    enabled: true
    accounts:
      account01:
        name: "外部系统"
        enabled: true
        api_key: "your-api-key"
        dm_policy: "allow"           # 私聊策略
        group_policy: "allow"        # 群聊策略
```

### 多账号配置

```yaml
channels:
  api:
    enabled: true
    accounts:
      # 管理员账号
      admin:
        name: "管理员"
        enabled: true
        api_key: "admin-secret-key"
        dm_policy: "allow"
        group_policy: "allow"

      # 只读账号
      readonly:
        name: "只读用户"
        enabled: true
        api_key: "readonly-key"
        dm_policy: "allow"
        group_policy: "disabled"
```

## 使用方式

### Chat API（OpenAI 兼容）

API 通道支持 OpenAI 兼容的 Chat Completions API：

```bash
curl -X POST http://localhost:9527/api/v1/chat/completions \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "main",
    "messages": [
      {"role": "user", "content": "你好"}
    ],
    "stream": true
  }'
```

**参数说明：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `model` | string | 智能体 ID |
| `messages` | array | 消息列表 |
| `stream` | bool | 是否流式输出 |
| `sessionId` | string | 会话 ID（可选） |

### 非流式响应

```json
{
  "id": "chatcmpl-xxx",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "main",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "你好！有什么可以帮助你的？"
      },
      "finish_reason": "stop"
    }
  ]
}
```

### 流式响应

```
data: {"id":"chatcmpl-xxx","choices":[{"delta":{"content":"你好"},"finish_reason":null}]}

data: {"id":"chatcmpl-xxx","choices":[{"delta":{"content":"！"},"finish_reason":null}]}

data: {"id":"chatcmpl-xxx","choices":[{"delta":{"content":""},"finish_reason":"stop"}]}

data: [DONE]
```

## 绑定配置

API 通道的绑定配置：

```yaml
bindings:
  - agent_id: "main"
    match:
      default: true
      channel: "api"
      account_id: "account01"
```

## 会话管理

### 创建会话

通过 `sessionId` 参数管理会话：

```bash
# 第一次请求
curl -X POST http://localhost:9527/api/v1/chat/completions \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "main",
    "messages": [{"role": "user", "content": "我叫张三"}],
    "sessionId": "session-001"
  }'

# 后续请求（智能体会记住上下文）
curl -X POST http://localhost:9527/api/v1/chat/completions \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "main",
    "messages": [{"role": "user", "content": "我叫什么名字？"}],
    "sessionId": "session-001"
  }'
```

### 清除会话

```bash
POST /api/v1/sessions/clear
Content-Type: application/json

{
  "agentId": "main",
  "sessionKey": "session-001"
}
```

## SDK 示例

### Python

```python
import openai

client = openai.OpenAI(
    api_key="your-api-key",
    base_url="http://localhost:9527/api/v1"
)

response = client.chat.completions.create(
    model="main",
    messages=[
        {"role": "user", "content": "你好"}
    ],
    stream=True
)

for chunk in response:
    print(chunk.choices[0].delta.content, end="")
```

### JavaScript

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'your-api-key',
  baseURL: 'http://localhost:9527/api/v1',
});

const stream = await client.chat.completions.create({
  model: 'main',
  messages: [{ role: 'user', content: '你好' }],
  stream: true,
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || '');
}
```

### Go

```go
package main

import (
    "context"
    "fmt"
    "github.com/sashabaranov/go-openai"
)

func main() {
    config := openai.DefaultConfig("your-api-key")
    config.BaseURL = "http://localhost:9527/api/v1"

    client := openai.NewClientWithConfig(config)

    stream, err := client.CreateChatCompletionStream(context.Background(), openai.ChatCompletionRequest{
        Model: "main",
        Messages: []openai.ChatCompletionMessage{
            {
                Role:    openai.ChatMessageRoleUser,
                Content: "你好",
            },
        },
        Stream: true,
    })
    if err != nil {
        panic(err)
    }
    defer stream.Close()

    for {
        response, err := stream.Recv()
        if err != nil {
            break
        }
        fmt.Print(response.Choices[0].Delta.Content)
    }
}
```

## 安全建议

### API Key 管理

1. **使用强密钥**：生成足够长度的随机密钥
2. **定期轮换**：定期更换 API Key
3. **权限分离**：不同用途使用不同的账号

### 网络安全

1. **使用 HTTPS**：生产环境必须使用 HTTPS
2. **IP 白名单**：限制允许访问的 IP
3. **速率限制**：配置请求频率限制

### 监控和日志

1. **记录请求**：记录 API 调用日志
2. **异常告警**：配置异常访问告警
3. **定期审计**：定期检查 API 使用情况

## 相关文档

- [通道配置](/guide/configuration/channels) - 通用通道配置
- [REST API](/guide/api/rest-api) - API 参考
- [安全配置](/guide/configuration/security) - 安全配置