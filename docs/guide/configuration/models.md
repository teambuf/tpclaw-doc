# 模型配置

配置 TPCLAW 使用的 LLM 模型供应商。

## 支持的供应商

| 供应商 | 类型 | 说明 |
|--------|------|------|
| OpenAI | 云端 | GPT-4, GPT-3.5 等 |
| 智谱 AI | 云端 | GLM-4, GLM-5 系列 |
| 阿里云百炼 | 云端 | 通义千问系列 |
| Ollama | 本地 | 开源本地模型 |
| Azure OpenAI | 云端 | Azure 托管的 OpenAI |
| 自定义 | - | 兼容 OpenAI API 的服务 |

## 配置结构

```yaml
models:
  default: "default"              # 默认供应商名称
  providers:
    <provider_id>:                # 供应商 ID（自定义）
      name: "显示名称"             # 供应商显示名称
      base_url: "https://..."     # API 地址
      api_key: "xxx"              # API Key
      model: "默认模型"            # 默认使用的模型
      models:                     # 可用模型列表
        - name: "模型名称"
          alias: "别名"           # 可选，如 "default"
          capabilities: []        # 可选，模型能力
          context_window: 128000  # 可选，上下文窗口大小
```

## 完整配置示例

```yaml
models:
  default: "default"
  providers:
    # 默认供应商（智谱 Coding）
    default:
      name: "智谱 Coding"
      base_url: "https://open.bigmodel.cn/api/coding/paas/v4"
      api_key: "${ZHIPU_API_KEY}"
      model: "glm-5"
      models:
        - name: "glm-5"
          alias: "default"
        - name: "glm-4"
        - name: "glm-4-flash"
        - name: "glm-4-plus"

    # 智谱 AI
    zhipu:
      name: "智谱"
      base_url: "https://open.bigmodel.cn/api/paas/v4"
      api_key: "${ZHIPU_API_KEY}"
      model: "GLM-5"
      models:
        - name: "GLM-5"
          alias: "default"
        - name: "GLM-4-Plus"
          capabilities: ["vision", "function_calling"]
        - name: "GLM-4-Flash"
        - name: "GLM-4.6V"
          capabilities: ["vision"]
          context_window: 128000

    # 阿里云百炼
    aliyun_bailian:
      name: "阿里云百炼"
      base_url: "https://dashscope.aliyuncs.com/compatible-mode/v1"
      api_key: "${ALIYUN_API_KEY}"
      model: "qwen-turbo"
      models:
        - name: "qwen-turbo"
        - name: "qwen-plus"
        - name: "qwen-max"
          capabilities: ["vision", "function_calling"]
          context_window: 32000

    # 阿里云百炼 Coding
    aliyun_bailian_coding:
      name: "阿里云百炼 Coding"
      base_url: "https://coding.dashscope.aliyuncs.com/v1"
      api_key: "${ALIYUN_API_KEY}"
      model: "qwen3.5-plus"
      models:
        - name: "qwen3.5-plus"
          alias: "default"
        - name: "qwen3-max"
        - name: "qwen3-coder-plus"

    # OpenAI
    openai:
      name: "OpenAI"
      base_url: "https://api.openai.com/v1"
      api_key: "${OPENAI_API_KEY}"
      model: "gpt-4"
      models:
        - name: "gpt-4"
          alias: "default"
          capabilities: ["vision", "function_calling"]
          context_window: 128000
        - name: "gpt-4-turbo"
          capabilities: ["vision", "function_calling"]
          context_window: 128000
        - name: "gpt-3.5-turbo"
          context_window: 16385

    # Ollama 本地模型
    ollama:
      name: "Ollama 本地模型"
      base_url: "http://localhost:11434/v1"
      api_key: ""
      model: "llama2"
      models:
        - name: "llama2"
        - name: "llama3"
        - name: "qwen2"
```

## 多模型配置

每个供应商可以配置多个可用模型：

### 模型字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | 是 | 模型名称（API 调用时使用） |
| `alias` | string | 否 | 模型别名，如 `default` 表示默认模型 |
| `capabilities` | []string | 否 | 模型能力标签 |
| `context_window` | int | 否 | 上下文窗口大小（token 数） |

### 模型能力

| 能力 | 说明 |
|------|------|
| `vision` | 支持图片输入 |
| `function_calling` | 支持工具调用 |
| `streaming` | 支持流式输出 |

### 别名使用

使用别名可以简化模型引用：

```yaml
models:
  - name: "glm-5"
    alias: "default"    # 使用 ${global.models.providers.default.model} 时返回 glm-5
```

## 在智能体中使用

### 使用默认供应商

```json
{
  "configuration": {
    "url": "${global.models.providers.default.base_url}",
    "key": "${global.models.providers.default.api_key}",
    "model": "${global.models.providers.default.model}"
  }
}
```

### 指定供应商

```json
{
  "configuration": {
    "url": "${global.models.providers.zhipu.base_url}",
    "key": "${global.models.providers.zhipu.api_key}",
    "model": "${global.models.providers.zhipu.model}"
  }
}
```

### 直接指定模型

```json
{
  "configuration": {
    "url": "${global.models.providers.openai.base_url}",
    "key": "${global.models.providers.openai.api_key}",
    "model": "gpt-4-turbo"
  }
}
```

## 通过 API 管理

### 获取供应商列表

```bash
GET /api/v1/config/models/providers
```

**响应示例：**

```json
[
  {
    "id": "default",
    "name": "智谱 Coding",
    "base_url": "https://open.bigmodel.cn/api/coding/paas/v4",
    "model": "glm-5",
    "models": [
      {"name": "glm-5", "alias": "default"},
      {"name": "glm-4"}
    ]
  }
]
```

### 添加供应商

```bash
POST /api/v1/config/models/providers
Content-Type: application/json

{
  "id": "openai",
  "name": "OpenAI",
  "base_url": "https://api.openai.com/v1",
  "api_key": "sk-xxx",
  "model": "gpt-4",
  "models": [
    {"name": "gpt-4", "alias": "default"},
    {"name": "gpt-3.5-turbo"}
  ]
}
```

### 更新供应商

```bash
PUT /api/v1/config/models/providers/openai
Content-Type: application/json

{
  "name": "OpenAI GPT",
  "model": "gpt-4-turbo"
}
```

### 更新 API Key

```bash
PUT /api/v1/config/models/providers/openai/api-key
Content-Type: application/json

{
  "apiKey": "sk-new-key"
}
```

### 删除供应商

```bash
DELETE /api/v1/config/models/providers/openai
```

## 模型参数

在智能体配置中可以设置模型参数：

```json
{
  "configuration": {
    "params": {
      "temperature": 0.7,
      "topP": 0.9,
      "maxTokens": 4096,
      "frequencyPenalty": 0.5,
      "presencePenalty": 0.5
    }
  }
}
```

### 参数说明

| 参数 | 范围 | 说明 |
|------|------|------|
| `temperature` | 0.0-2.0 | 采样温度，越高越随机 |
| `topP` | 0.0-1.0 | 核采样参数 |
| `maxTokens` | int | 最大输出长度 |
| `frequencyPenalty` | 0.0-1.0 | 频率惩罚，防止重复 |
| `presencePenalty` | 0.0-1.0 | 存在惩罚，鼓励新话题 |

## 成本优化

### 使用本地模型

对于简单任务，使用 Ollama 本地模型：

```yaml
providers:
  ollama:
    base_url: "http://localhost:11434/v1"
    model: "llama2"
```

### 合理设置参数

```json
{
  "params": {
    "maxTokens": 2000,
    "temperature": 0.7
  }
}
```

### 按任务选择模型

- 简单任务：使用轻量模型（gpt-3.5-turbo、glm-4-flash）
- 复杂任务：使用高级模型（gpt-4、glm-4-plus）
- 代码任务：使用编码专用模型

## 相关文档

- [配置文件](/guide/configuration/config-file) - 主配置文件
- [智能体配置](/guide/configuration/agents) - 智能体配置
- [REST API](/guide/api/rest-api) - API 参考