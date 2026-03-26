# 图片识别智能体示例

构建一个图片识别和分析智能体。

## 场景描述
创建一个能够：
- 识别图片内容
- 提取图片文字
- 分析图片数据
- 生成图片描述

## 智能体配置
```json
{
  "ruleChain": {
    "id": "image_agent",
    "name": "图片识别"
  },
  "metadata": {
    "nodes": [
      {
        "id": "node_agent",
        "type": "ai/agent",
        "configuration": {
          "model": "gpt-4-vision",
          "systemPrompt": "你是一个图片识别专家...",
          "tools": []
        }
      }
    ]
  }
}
```
## 相关文档
- [智能体配置](/guide/core-features/agents) - 详细配置
