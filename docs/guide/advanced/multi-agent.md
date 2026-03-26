# 多智能体协作

TPCLAW 支持主智能体调用多个子智能体协作完成复杂任务。

## 协作模式

```mermaid
graph TB
    subgraph "主智能体"
        A[任务接收]
        B[任务分解]
        C[结果汇总]
    end

    subgraph "子智能体"
        D[图片识别]
        E[文本处理]
        F[数据分析]
    end

    A --> B
    B --> D
    B --> E
    B --> F
    D --> C
    E --> C
    F --> C
    C --> G[最终响应]
```

## 配置子智能体

### 定义子智能体工具
```json
{
  "tools": [
    {
      "type": "agent",
      "name": "图片识别",
      "targetId": "agent01",
      "description": "图片识别和理解专家"
    },
    {
      "type": "agent",
      "name": "客服",
      "targetId": "agent02",
      "description": "客服支持"
    }
  ]
}
```

### 子智能体配置文件
```
data/agents/
├── main.json      # 主智能体
├── agent01.json   # 图片识别智能体
├── agent02.json   # 客服智能体
└── agent03.json   # 销售智能体
```

## 调用流程
```mermaid
sequenceDiagram
    participant User
    participant Main
    participant SubAgent
    participant LLM

    User->>Main: 发送消息
    Main->>LLM: 分析任务
    LLM->>Main: 需要调用子智能体
    Main->>SubAgent: 调用 agent01
    SubAgent->>LLM: 处理请求
    LLM->>SubAgent: 返回结果
    SubAgent->>Main: 返回结果
    Main->>LLM: 继续处理
    LLM->>Main: 最终响应
    Main->>User: 返回结果
```

## 相关文档
- [子智能体](/guide/advanced/sub-agent) - 子智能体调用方式详解
- [统一智能体设计](/guide/advanced/unified-agent) - 智能体设计模式
- [智能体配置](/guide/core-features/agents) - 智能体详细配置
