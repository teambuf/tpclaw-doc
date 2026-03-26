# WebSocket API

通过 WebSocket 实现实时双向通信。

## 连接地址

```
ws://localhost:9527/ws
```

## 消息格式

### 发送消息

```json
{
  "type": "message",
  "sessionId": "session-001",
  "agentId": "main",
  "content": "你好"
}
```

### 接收响应

```json
{
  "type": "response",
  "sessionId": "session-001",
  "content": "你好！有什么可以帮助你的？",
  "done": true
}
```

### 流式响应

```json
{"type": "stream", "sessionId": "session-001", "content": "你", "done": false}
{"type": "stream", "sessionId": "session-001", "content": "好", "done": false}
{"type": "stream", "sessionId": "session-001", "content": "！", "done": true}
```

## 消息类型

| 类型 | 说明 | 方向 |
|------|------|------|
| `message` | 普通消息 | 客户端 → 服务端 |
| `response` | 响应消息 | 服务端 → 客户端 |
| `stream` | 流式消息 | 服务端 → 客户端 |
| `error` | 错误消息 | 服务端 → 客户端 |
| `ping/pong` | 心跳 | 双向 |

## 前端示例

```javascript
const ws = new WebSocket('ws://localhost:9527/ws');

ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'message',
    sessionId: 'session-001',
    agentId: 'main',
    content: '你好'
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};
```

## 相关文档
- [REST API](/guide/api/rest-api) - HTTP API
- [WebSocket 通道](/guide/channels/websocket) - 通道配置
