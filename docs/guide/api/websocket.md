# WebSocket API

通过 WebSocket 实时接收智能体的事件流（推理过程、工具调用、流式文本等）。

## 连接地址

```
ws://localhost:9527/api/v1/ws
```

支持三个 WebSocket 端点：

| 端点 | 说明 |
|------|------|
| `/api/v1/ws` | 通用端点，可通过 `?agentId=xxx` 指定智能体（默认 `main`） |
| `/api/v1/agents/{agentId}/ws` | 指定智能体的事件流 |
| `/api/v1/event/ws/{clientId}?chainId=xxx` | 全局事件流，可选按 `chainId` 过滤 |

## 客户端消息

客户端可以发送以下消息：

### 心跳

```json
{"type": "ping"}
```

服务端回复 `{"type": "pong"}`。

### 切换智能体订阅

仅在 `/api/v1/ws` 端点可用：

```json
{"type": "subscribe", "agentId": "my-agent"}
```

## 服务端事件

服务端推送 `Event` 结构的事件流：

```json
{
  "id": "evt-xxx",
  "type": "text",
  "agentId": "main",
  "taskId": "task-xxx",
  "timestamp": "2025-01-01T12:00:00Z",
  "payload": {"content": "你好！"}
}
```

### 事件类型

| 类型 | 说明 | Payload 示例 |
|------|------|-------------|
| `text` | 流式文本输出 | `{"content": "你好！"}` |
| `think` | 思考/推理过程 | `{"content": "分析用户意图..."}` |
| `tool` | 工具调用 | `{"tool": "read", "args": {"path": "/file.md"}}` |
| `tool_result` | 工具返回结果 | `{"content": "文件内容..."}` |
| `done` | 执行完成 | `{"content": ""}` |
| `error` | 错误信息 | `{"message": "工具调用失败"}` |
| `status` | 状态变更 | `{"status": "running"}` |
| `progress` | 进度更新 | `{"progress": 50, "message": "处理中"}` |

## 前端示例

```javascript
const ws = new WebSocket('ws://localhost:9527/api/v1/ws?agentId=main');

ws.onopen = () => {
  // 发送心跳
  setInterval(() => ws.send(JSON.stringify({type: 'ping'})), 30000);
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  switch(data.type) {
    case 'text':
      process.stdout.write(data.payload.content);
      break;
    case 'tool':
      console.log(`调用工具: ${data.payload.tool}`);
      break;
    case 'done':
      console.log('\n完成');
      break;
    case 'error':
      console.error(`错误: ${data.payload.message}`);
      break;
    case 'pong':
      break;
  }
};
```

## 相关文档

- [REST API](/guide/api/rest-api) - HTTP API
- [CLI 命令参考](/guide/api/cli) - 命令行工具
