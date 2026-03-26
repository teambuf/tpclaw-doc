# MCP 协议

Model Context Protocol (MCP) 是一个标准协议，用于连接 AI 模型与外部工具。

## 概述
TPCLAW 同时支持 MCP 客户端和服务器：
- **MCP 客户端**: 连接外部 MCP 服务器
- **MCP 服务器**: 为其他客户端提供工具

## MCP 客户端
### 配置
```json
{
  "type": "ai/external/mcpClient",
  "configuration": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "/workspace"]
  }
}
```
## MCP 服务器
### 配置
```yaml
mcp:
  server:
    enabled: true
    port: 8080
```
## 相关文档
- [工具概述](/guide/tools/) - 工具系统概述
