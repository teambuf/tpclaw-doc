# 大模型配置

配置 TpClaw 使用的 LLM 大模型供应商。支持所有**兼容 OpenAI API 协议**的供应商。

## 重要说明

- **主智能体使用默认供应商**，添加供应商后需要将它设为默认才会生效
- 系统同一时间只能有一个默认供应商
- 每个供应商可以配置多个可用模型

---

## 配置步骤

### 进入大模型配置

点击左侧菜单「设置」→ 选择「大模型配置」标签页。

![大模型配置](/img/llm-setting/0.设置-大模型配置.png)

供应商列表页面展示所有已配置的供应商卡片，每个卡片显示：
- 供应商名称、Base URL、默认模型
- 状态标签：「默认」「已配置」「未配置 API Key」
- 可用模型列表和操作按钮（星标、编辑、删除）

### 添加供应商

点击右上角「+ 添加供应商」按钮：

![添加供应商](/img/llm-setting/1.添加供应商.png)

在弹出的对话框中填写：

| 字段 | 说明 |
|------|------|
| **供应商 ID** | 从预设列表选择（如 `openai`、`zhipu`）或自定义输入，用于唯一标识 |
| **显示名称** | 供应商的显示名称，如「OpenAI」「智谱 AI」 |
| **Base URL** | API 接口地址，选择预设供应商会自动填充 |
| **API Key** | 该供应商的 API 密钥 |
| **可用模型** | 配置该供应商支持的模型列表，点击星标设为默认模型 |

选择预设供应商时，Base URL 会自动填充。也可以手动输入 Base URL 来接入任何兼容 OpenAI 协议的服务。

### 设置默认供应商

添加供应商后，点击供应商卡片上的**星标按钮**（⭐），将其设为默认供应商。

![设置默认供应商](/img/llm-setting/2.设置成默认供应商.png)

设为默认后：
- 卡片上会显示绿色的「默认」标签
- **主智能体将使用该供应商的模型**
- 之前设置的默认供应商会自动取消

> 未配置 API Key 的供应商无法设为默认，请先点击编辑按钮配置 API Key。

---

## 支持的供应商

TpClaw 支持所有兼容 OpenAI API 协议的供应商，以下是常见的预设供应商：

| 供应商 | 类型 | 说明 |
|--------|------|------|
| 智谱 AI | 云端 | GLM-5、GLM-4 系列 |
| 阿里云百炼 | 云端 | 通义千问系列 |
| OpenAI | 云端 | GPT-4、GPT-3.5 系列 |
| DeepSeek | 云端 | DeepSeek 系列 |
| Ollama | 本地 | 开源本地模型 |
| 自定义 | - | 任何兼容 OpenAI 协议的服务 |

### 接入自定义供应商

如果你的供应商不在预设列表中，只需满足以下条件即可接入：

1. API 兼容 OpenAI Chat Completions 协议（`/v1/chat/completions`）
2. 填写正确的 Base URL 和 API Key

例如接入 DeepSeek：
- 供应商 ID：`deepseek`
- Base URL：`https://api.deepseek.com/v1`
- API Key：你的 DeepSeek API Key

---

## 模型参数

在供应商卡片中点击编辑按钮，可以展开配置模型参数：

| 参数 | 范围 | 说明 |
|------|------|------|
| `temperature` | 0.0-2.0 | 采样温度，越高越随机 |
| `topP` | 0.0-1.0 | 核采样参数 |
| `maxTokens` | int | 最大输出长度 |
| `frequencyPenalty` | 0.0-1.0 | 频率惩罚，防止重复 |
| `presencePenalty` | 0.0-1.0 | 存在惩罚，鼓励新话题 |

---

## YAML 配置参考

除了通过控制台界面配置外，也可以直接编辑配置文件：

```yaml
models:
  default: "default"                    # 默认供应商 ID
  providers:
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

    openai:
      name: "OpenAI"
      base_url: "https://api.openai.com/v1"
      api_key: "${OPENAI_API_KEY}"
      model: "gpt-4"
      models:
        - name: "gpt-4"
        - name: "gpt-4-turbo"
        - name: "gpt-3.5-turbo"

    ollama:
      name: "Ollama 本地模型"
      base_url: "http://localhost:11434/v1"
      api_key: ""
      model: "llama2"
```

### 在智能体中引用

智能体配置中通过变量引用供应商：

```json
{
  "url": "${global.models.providers.default.base_url}",
  "key": "${global.models.providers.default.api_key}",
  "model": "${global.models.providers.default.model}"
}
```

---

## 相关文档

- [配置文件](/guide/configuration/config-file) - 主配置文件说明
- [智能体配置](/guide/configuration/agents) - 智能体详细配置
- [快速入门](/guide/getting-started/quickstart) - 快速上手指南
