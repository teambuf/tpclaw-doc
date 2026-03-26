# 智能体配置

智能体配置分为两个层级：

| 配置层级 | 文件 | 用途 |
|---------|------|------|
| 全局默认配置 | `config.yaml` | 心跳、会话、压缩、媒体等默认值 |
| 智能体定义 | `data/agents/*.json` | 具体智能体的规则链、模型、工具配置 |

## 全局默认配置

在 `config.yaml` 中配置智能体默认值：

```yaml
agents:
  defaults:
    # 默认智能体 ID
    default_id: "main"

    # 心跳配置
    heartbeat:
      interval: "30m"           # 心跳间隔，0 表示关闭
      prompt: ""                # 自定义提示词，为空使用默认值
      active_hours:             # 激活时间段
        start: "09:00"
        end: "22:00"
      target: ""                # 目标通道，为空使用默认通道
      load_history: false       # 是否加载历史消息

    # 会话配置
    session:
      enabled: true
      storage_path: "sessions"  # 存储目录
      max_messages: 100         # 最大消息数量
      default_scope: "per_peer" # 作用域: per_peer, per_channel, global
      tool_call:
        save_tool_calls: true           # 保存工具调用记录
        keep_tool_calls_count: 5        # 保留最近工具调用数量
        max_tool_result_size: 2000      # 工具结果最大字符数

    # 压缩配置
    compaction:
      mode: "safeguard"         # safeguard | auto | off
      keep_recent_count: 10     # 保留最近消息数
      target_tokens: 80000      # 目标 token 数
      memory_flush: true        # 压缩时刷新内存

    # 技能目录
    global_skills_dir: "skills"

    # 媒体存储
    media:
      enable: true
      storage_path: "media"
      max_file_size: 52428800   # 50MB

  # 单独智能体配置（覆盖默认值）
  list:
    - id: "main"
      default: true
      model: "gpt-4"
    - id: "agent01"
      heartbeat:
        interval: "1h"
```

### 配置项说明

| 配置项 | 说明 |
|-------|------|
| `heartbeat.interval` | 心跳间隔，触发智能体主动检查任务 |
| `heartbeat.active_hours` | 激活时间段，支持跨天（如 22:00-06:00） |
| `session.default_scope` | 会话作用域：`per_peer`(按用户)、`per_channel`(按群)、`global`(全局) |
| `compaction.mode` | `safeguard`(智能防护)、`auto`(全自动)、`off`(关闭) |

### 会话作用域

| 作用域 | 说明 |
|--------|------|
| `per_peer` | 按用户隔离，每个用户独立会话 |
| `per_channel` | 按群组隔离，群内共享会话 |
| `global` | 全局共享，所有用户同一会话 |

### 压缩模式

| 模式 | 说明 |
|------|------|
| `safeguard` | 智能防护模式，在上下文接近限制时自动压缩 |
| `auto` | 全自动模式，更激进的压缩策略 |
| `off` | 关闭自动压缩，需手动使用 `/compact` 命令 |

## 智能体定义文件

智能体以规则链 JSON 格式存储在 `data/agents/` 目录：

```
data/agents/
├── main.json        # 主智能体
├── agent01.json     # 子智能体1
├── agent02.json     # 子智能体2
└── agent03.json     # 子智能体3
```

### 文件结构

```json
{
  "ruleChain": {
    "id": "main",
    "name": "智能体名称",
    "additionalInfo": {
      "category": "agents",
      "description": "智能体描述",
      "icon": "🤖"
    }
  },
  "metadata": {
    "firstNodeIndex": 0,
    "nodes": [...],
    "connections": [...]
  }
}
```

## 智能体节点配置

智能体核心是 `ai/agent` 类型节点：

```json
{
  "id": "node_main",
  "type": "ai/agent",
  "name": "TeamClaw",
  "configuration": {
    "url": "${global.models.providers.default.base_url}",
    "key": "${global.models.providers.default.api_key}",
    "model": "${global.models.providers.default.model}",
    "systemPrompt": "...",
    "maxStep": 100,
    "maxToolOutputLength": 50000,
    "params": {...},
    "tools": [...]
  }
}
```

### 节点配置项

| 配置项 | 类型 | 说明 |
|-------|------|------|
| `url` | string | LLM API 地址，支持 `${global.xxx}` 变量 |
| `key` | string | API Key，支持变量引用 |
| `model` | string | 模型名称 |
| `systemPrompt` | string | 系统提示词 |
| `maxStep` | int | 最大迭代步数，默认 50 |
| `maxToolOutputLength` | int | 工具输出最大长度，默认 50000 |
| `params` | object | 模型参数 |
| `tools` | array | 工具列表 |

### 模型参数

```json
{
  "params": {
    "temperature": 0.7,
    "topP": 0.9,
    "maxTokens": 4096,
    "frequencyPenalty": 0.5,
    "presencePenalty": 0.5,
    "stop": ["END"],
    "responseFormat": "text",
    "keepThink": false
  }
}
```

| 参数 | 范围 | 说明 |
|-----|------|------|
| `temperature` | 0.0-2.0 | 采样温度，越高越随机 |
| `topP` | 0.0-1.0 | 核采样参数 |
| `maxTokens` | int | 最大输出长度 |
| `frequencyPenalty` | 0.0-1.0 | 频率惩罚，防止重复 |
| `presencePenalty` | 0.0-1.0 | 存在惩罚，鼓励新话题 |
| `responseFormat` | string | 输出格式：`text`、`json_object` |

## 系统提示词

### 基本用法

```json
{
  "systemPrompt": "你是一个智能助手，帮助用户解决问题。"
}
```

### 引用模板文件

使用 `${include()}` 引用工作空间中的模板文件：

```json
{
  "systemPrompt": "${include(global.root_dir+'/workspace/IDENTITY.md')}\n\n---\n\n${include(global.root_dir+'/workspace/AGENTS.md')}"
}
```

### 条件引用

使用 `${fileExists()}` 判断文件是否存在：

```json
{
  "systemPrompt": "${fileExists(global.root_dir+'/workspace/BOOTSTRAP.md') ? include(global.root_dir+'/workspace/BOOTSTRAP.md') + '\\n\\n---\\n\\n' : ''}${include(global.root_dir+'/workspace/IDENTITY.md')}"
}
```

### 内置变量

| 变量 | 说明 |
|-----|------|
| `${global.root_dir}` | 数据根目录 |
| `${global.models.providers.xxx}` | 模型配置 |
| `${ruleChain.id}` | 当前规则链 ID |
| `${now()}` | 当前时间 |

## 工具配置

### 内置工具 (builtin)

```json
{
  "tools": [
    {
      "type": "builtin",
      "name": "read",
      "description": "读取文件内容",
      "config": {
        "maxReadLines": 2000,
        "workDir": "${global.root_dir}/workspace"
      }
    },
    {
      "type": "builtin",
      "name": "write",
      "config": {
        "workDir": "${global.root_dir}/workspace"
      }
    },
    {
      "type": "builtin",
      "name": "edit",
      "config": {
        "workDir": "${global.root_dir}/workspace"
      }
    },
    {
      "type": "builtin",
      "name": "bash",
      "config": {
        "timeout": 60,
        "workDir": "${global.root_dir}/workspace"
      }
    },
    {
      "type": "builtin",
      "name": "skill",
      "config": {
        "userDirs": ["${global.root_dir}/workspace/skills"]
      }
    },
    {
      "type": "builtin",
      "name": "browser_use",
      "config": {
        "headless": false
      }
    }
  ]
}
```

### 子智能体工具 (agent)

调用其他智能体作为工具：

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

### 规则链工具 (rulechain)

调用指定规则链：

```json
{
  "tools": [
    {
      "type": "rulechain",
      "name": "数据处理",
      "targetId": "chain_data_process",
      "description": "数据清洗和转换"
    }
  ]
}
```

## 通过 API 管理

### 列出智能体

```bash
GET /api/v1/agents
```

### 获取智能体

```bash
GET /api/v1/agents/main
```

### 创建智能体

```bash
POST /api/v1/agents
Content-Type: application/json

{
  "ruleChain": {
    "id": "my-agent",
    "name": "我的智能体"
  },
  "metadata": {...}
}
```

### 更新智能体

```bash
PUT /api/v1/agents/my-agent
Content-Type: application/json

{...}
```

### 删除智能体

```bash
DELETE /api/v1/agents/my-agent
```

### 重载智能体

```bash
POST /api/v1/agents/my-agent/reload
```

## 相关文档

- [模型配置](/guide/configuration/models) - LLM 供应商配置
- [通道配置](/guide/configuration/channels) - IM 通道配置
- [工作空间](/guide/workspace/structure) - 工作空间模板文件
- [工具系统](/guide/tools/read) - 工具详细说明
- [REST API](/guide/api/rest-api) - API 参考