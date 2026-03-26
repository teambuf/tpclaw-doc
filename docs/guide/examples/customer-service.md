# 客服智能体示例

构建一个完整的客服智能体系统。

## 场景描述
创建一个能够：
- 自动回复常见问题
- 处理工单
- 转接人工客服
- 记录用户反馈

## 智能体配置
```json
{
  "ruleChain": {
    "id": "customer_service",
    "name": "客服智能体"
  },
  "metadata": {
    "nodes": [
      {
        "id": "node_agent",
        "type": "ai/agent",
        "configuration": {
          "model": "gpt-4",
          "systemPrompt": "你是一个专业的客服代表...",
          "tools": [
            {"type": "builtin", "name": "read"},
            {"type": "builtin", "name": "write"},
            {"type": "agent", "targetId": "ticket_agent"}
          ]
        }
      }
    ]
  }
}
```
## 相关文档
- [智能体配置](/guide/core-features/agents) - 详细配置
- [多智能体协作](/guide/advanced/multi-agent) - 协作模式
