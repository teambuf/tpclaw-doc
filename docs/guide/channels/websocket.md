# WebSocket 通道

配置 WebSocket 作为智能体的消息通道。

## 概述

WebSocket 提供了一种通用的实时通信方式，适用于自定义客户端或第三方系统集成。

### 支持的功能

- ✅ 实时双向通信
- ✅ 流式消息输出
- ✅ 自定义协议
- ✅ 多客户端连接

## 配置

WebSocket 通道通过 REST API 和 WebSocket 端点提供服务，无需额外配置。

### 连接地址

```
ws://localhost:9527/api/v1/ws
```

## 使用方式

### JavaScript 客户端示例

```javascript
// 创建 WebSocket 连接
const ws = new WebSocket('ws://localhost:9527/api/v1/ws');

// 连接打开
ws.onopen = function() {
  console.log('WebSocket connected');
  
  // 发送消息
  ws.send(JSON.stringify({
    type: 'chat',
    agentId: 'main',
    message: '你好'
  }));
};

// 接收消息
ws.onmessage = function(event) {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};

// 连接关闭
ws.onclose = function() {
  console.log('WebSocket disconnected');
};

// 错误处理
ws.onerror = function(error) {
  console.error('WebSocket error:', error);
};
```

### Python 客户端示例

```python
import websocket
import json

def on_message(ws, message):
    data = json.loads(message)
    print(f"Received: {data}")

def on_error(ws, error):
    print(f"Error: {error}")

def on_close(ws, close_status_code, close_msg):
    print("Connection closed")

def on_open(ws):
    print("Connected")
    # 发送消息
    ws.send(json.dumps({
        "type": "chat",
        "agentId": "main",
        "message": "你好"
    }))

# 连接 WebSocket
ws = websocket.WebSocketApp(
    "ws://localhost:9527/api/v1/ws",
    on_open=on_open,
    on_message=on_message,
    on_error=on_error,
    on_close=on_close
)

ws.run_forever()
```

## 消息格式

### 发送消息

```json
{
  "type": "chat",
  "agentId": "main",
  "sessionId": "session-001",
  "message": "你好"
}
```

### 接收消息

```json
{
  "type": "message",
  "agentId": "main",
  "content": "你好！有什么可以帮助你的？",
  "done": false
}
```

### 流式消息

```json
{
  "type": "stream",
  "agentId": "main",
  "content": "你好",
  "done": false
}
```

```json
{
  "type": "stream",
  "agentId": "main",
  "content": "！",
  "done": false
}
```

```json
{
  "type": "stream",
  "agentId": "main",
  "content": "",
  "done": true
}
```

## 消息类型

| 类型 | 说明 |
|------|------|
| `chat` | 发送聊天消息 |
| `message` | 完整消息响应 |
| `stream` | 流式消息片段 |
| `error` | 错误消息 |
| `ping` | 心跳请求 |
| `pong` | 心跳响应 |

## 心跳机制

客户端应定期发送心跳消息以保持连接：

```javascript
// 每 30 秒发送心跳
setInterval(() => {
  ws.send(JSON.stringify({ type: 'ping' }));
}, 30000);
```

## 相关文档

- [REST API](/guide/api/rest-api) - HTTP API 参考
- [WebSocket API](/guide/api/websocket) - WebSocket API 详细说明