# 向量检索 RAG

配置向量检索增强生成能力。

## RAG 架构
```mermaid
graph LR
    A[文档] --> B[文档加载器]
    B --> C[文本分块]
    C --> D[向量化]
    D --> E[向量存储]
    E --> F[相似度检索]
    F --> G[LLM]
```

## 组件配置
### Embedding 配置
```yaml
embedding:
  provider: openai
  model: text-embedding-3-small
```
### 向量存储配置
```yaml
vectorstore:
  type: redis
  redis:
    addr: localhost:6379
```
## 规则链配置
```json
{
  "nodes": [
    {
      "type": "ai/embedding/openai",
      "configuration": {
        "model": "text-embedding-3-small"
      }
    },
    {
      "type": "ai/indexer/redis",
      "configuration": {
        "indexName": "documents"
      }
    },
    {
      "type": "ai/retriever/redis",
      "configuration": {
        "topK": 5
      }
    }
  ]
}
```
## 相关文档
- [核心功能 - 记忆](/guide/core-features/memory) - 记忆系统
