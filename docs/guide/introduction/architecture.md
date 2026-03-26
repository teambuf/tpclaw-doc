# 架构概览

本文档介绍 TPCLAW 的系统架构和核心组件。

## 整体架构

```mermaid
graph TB
    subgraph "用户接入层"
        U1[Web 控制台]
        U2[CLI 命令行]
        U3[IM 通道]
        U4[API 调用]
    end

    subgraph "网关层"
        G1[HTTP Server]
        G2[WebSocket Server]
        G3[通道适配器]
    end

    subgraph "核心层"
        C1[规则引擎]
        C2[智能体编排器]
        C3[会话管理器]
        C4[工具管理器]
    end

    subgraph "服务层"
        S1[LLM 服务]
        S2[记忆服务]
        S3[事件服务]
        S4[任务调度]
    end

    subgraph "存储层"
        D1[文件存储]
        D2[会话存储]
        D3[向量数据库]
    end

    subgraph "外部服务"
        E1[OpenAI/智谱/阿里云]
        E2[Ollama]
        E3[飞书/钉钉/企业微信]
    end

    U1 --> G1
    U2 --> G1
    U3 --> G3
    U4 --> G1

    G1 --> C1
    G2 --> C1
    G3 --> C1

    C1 --> C2
    C2 --> C3
    C2 --> C4

    C2 --> S1
    C2 --> S2
    C1 --> S3
    C1 --> S4

    S2 --> D1
    C3 --> D2
    S1 --> D3

    S1 --> E1
    S1 --> E2
    G3 --> E3
```

## 核心组件

### 1. 规则引擎 (RuleGo)

规则引擎是 TPCLAW 的核心，负责：
- 加载和管理规则链
- 执行节点逻辑
- 管理节点之间的连接
- 处理消息路由

```go
// 规则引擎初始化
config := rulego.NewConfig()
ruleEngine, _ := rulego.New("default", []byte(ruleChainJson), rulego.WithConfig(config))

// 执行规则链
ruleEngine.OnMsg(msg, ctx)
```

### 2. 智能体编排器

智能体编排器负责：
- 管理智能体生命周期
- 协调多智能体协作
- 处理工具调用
- 管理 LLM 交互

```mermaid
sequenceDiagram
    participant User
    participant Orchestrator
    participant MainAgent
    participant SubAgent
    participant LLM

    User->>Orchestrator: 发送消息
    Orchestrator->>MainAgent: 路由到主智能体
    MainAgent->>LLM: 请求处理
    LLM->>MainAgent: 返回响应（需调用子智能体）
    MainAgent->>SubAgent: 调用子智能体
    SubAgent->>LLM: 子智能体请求
    LLM->>SubAgent: 子智能体响应
    SubAgent->>MainAgent: 返回结果
    MainAgent->>Orchestrator: 最终响应
    Orchestrator->>User: 返回结果
```

### 3. 会话管理器

会话管理器负责：
- 会话创建和销毁
- 上下文维护
- 历史记录管理
- 会话压缩

```go
// 会话存储接口
type SessionStorage interface {
    Save(sessionId string, messages []Message) error
    Load(sessionId string) ([]Message, error)
    Delete(sessionId string) error
}
```

### 4. 工具管理器

工具管理器负责：
- 工具注册和发现
- 工具调用执行
- 权限控制
- 结果处理

```mermaid
graph LR
    subgraph "工具管理器"
        A[工具注册表]
        B[调用处理器]
        C[权限检查器]
    end

    A --> D[内置工具]
    A --> E[自定义工具]
    A --> F[MCP 工具]

    B --> G[执行器]
    C --> H[权限配置]

    G --> I[返回结果]
```

## 数据流

### 消息处理流程

```mermaid
sequenceDiagram
    participant Channel
    participant Adapter
    participant RuleEngine
    participant Agent
    participant Tool
    participant LLM

    Channel->>Adapter: 接收消息
    Adapter->>Adapter: 解析和转换
    Adapter->>RuleEngine: 发送到规则链
    RuleEngine->>Agent: 执行智能体节点
    Agent->>LLM: 调用 LLM

    alt 需要工具调用
        LLM->>Agent: 返回工具调用请求
        Agent->>Tool: 执行工具
        Tool->>Agent: 返回结果
        Agent->>LLM: 继续处理
    end

    LLM->>Agent: 返回响应
    Agent->>RuleEngine: 节点完成
    RuleEngine->>Adapter: 返回结果
    Adapter->>Channel: 发送响应
```

## 目录结构

```
tpclaw/
├── cmd/                          # 应用入口
│   ├── cli/                      # CLI 工具
│   │   ├── main.go
│   │   └── commands/             # Cobra 命令
│   └── server/                   # HTTP 服务
│       └── main.go
│
├── internal/                     # 内部包
│   ├── api/                      # HTTP API
│   │   └── handler/              # 请求处理器
│   ├── command/                  # 命令处理框架
│   ├── components/               # 组件注册
│   │   ├── ai/                   # AI 组件
│   │   └── im/                   # IM 组件
│   ├── config/                   # 配置管理
│   ├── domain/                   # 领域模型
│   ├── processor/                # 消息处理器
│   ├── service/                  # 业务服务
│   └── session/                  # 会话管理
│
├── configs/                      # 配置文件
│   └── config.yaml
│
├── data/                         # 数据目录
│   ├── agents/                   # 智能体配置
│   └── sessions/                 # 会话数据
│
└── web/                          # Web 前端
    └── src/
```

## 组件依赖

```mermaid
graph BT
    subgraph "应用层"
        A1[CLI]
        A2[Server]
    end

    subgraph "服务层"
        S1[AgentService]
        S2[RuleService]
        S3[SkillService]
        S4[IMService]
    end

    subgraph "组件层"
        C1[AI Components]
        C2[IM Components]
    end

    subgraph "核心层"
        R1[RuleGo Engine]
        R2[Session Manager]
    end

    A1 --> S1
    A1 --> S2
    A2 --> S1
    A2 --> S4

    S1 --> C1
    S2 --> R1
    S3 --> C1
    S4 --> C2

    C1 --> R1
    R1 --> R2
```

## 部署架构

### 单机部署

```mermaid
graph TB
    subgraph "单机部署"
        A[TPCLAW 进程]
        B[文件存储]
        C[本地 LLM]
    end

    A --> B
    A --> C
```

### 分布式部署

```mermaid
graph TB
    subgraph "负载均衡"
        LB[Nginx/ALB]
    end

    subgraph "应用集群"
        A1[TPCLAW Node 1]
        A2[TPCLAW Node 2]
        A3[TPCLAW Node 3]
    end

    subgraph "共享存储"
        S1[Redis]
        S2[MinIO/OSS]
        S3[Milvus]
    end

    LB --> A1
    LB --> A2
    LB --> A3

    A1 --> S1
    A2 --> S1
    A3 --> S1

    A1 --> S2
    A2 --> S2
    A3 --> S2

    A1 --> S3
    A2 --> S3
    A3 --> S3
```

## 扩展点

TPCLAW 提供了多个扩展点：

| 扩展点 | 说明 | 方式 |
|--------|------|------|
| 自定义节点 | 添加新的处理节点 | 实现 Node 接口 |
| 自定义工具 | 添加新的工具 | 实现 Tool 接口 |
| 自定义通道 | 添加新的 IM 通道 | 实现 Channel 接口 |
| 切面编程 | 添加横切关注点 | 注册 Aspect |
| 事件监听 | 监听系统事件 | 订阅 Event |

## 下一步

- [与其他方案对比](/guide/introduction/comparison) - 了解 TPCLAW 的优势
- [安装指南](/guide/getting-started/installation) - 开始安装
- [核心功能](/guide/core-features/agents) - 了解核心功能
