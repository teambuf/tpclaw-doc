# 配置文件

TPCLAW 使用 YAML 格式的配置文件进行系统配置。

## 配置文件位置

TPCLAW 按以下优先级查找配置文件：

1. 命令行参数指定的路径：`tpclaw --config /path/to/config.yaml`
2. 环境变量指定的路径：`TPCLAW_CONFIG=/path/to/config.yaml`
3. 二进制所在目录：`./config.yaml` 或 `./config.yml`
4. 当前工作目录：`./config.yaml` 或 `./config.yml`
5. configs 目录：`./configs/config.yaml` 或 `./configs/config.yml`
6. 用户目录：`~/.tpclaw/config.yaml` 或 `~/.tpclaw/config.yml`

如果未找到配置文件，TPCLAW 会自动生成默认配置到当前目录。

## 环境变量

配置文件支持使用环境变量：

```yaml
# 使用 ${VAR} 语法引用环境变量
api_key: "${OPENAI_API_KEY}"

# 带默认值（如果环境变量不存在则使用默认值）
api_key: "${OPENAI_API_KEY:-default-key}"
```

### 常用环境变量

| 变量名 | 说明 |
|--------|------|
| `TPCLAW_CONFIG` | 配置文件路径 |
| `TPCLAW_APP_NAME` | 应用名称 |
| `TPCLAW_API_KEY` | API 认证密钥 |
| `OPENAI_API_KEY` | OpenAI API Key |
| `ZHIPU_API_KEY` | 智谱 AI API Key |
| `ALIYUN_API_KEY` | 阿里云 API Key |
| `FEISHU_APP_ID` | 飞书 App ID |
| `FEISHU_APP_SECRET` | 飞书 App Secret |

## 完整配置示例

```yaml
# =====================================================
# TPCLAW 配置文件
# =====================================================

# 服务器配置
server:
  host: "0.0.0.0"
  port: 9527

# 数据目录配置
data:
  # 数据根目录，agents/workspaces/plugins 目录固定在此目录下
  root_dir: "./"
  # 日志目录，支持相对路径（相对于工作目录）和绝对路径
  logs_dir: "logs"

# 日志配置
logging:
  level: "debug"           # debug, info, warn, error
  format: "console"        # json, console
  development: false       # 开发模式（彩色输出）
  encoding: "utf-8"
  output:
    stdout: true           # 输出到标准输出
    file:
      enabled: true
      path: "logs/app.log"
      max_size: 100        # 单个文件最大 MB
      max_backups: 30      # 保留旧文件数量
      max_age: 7           # 保留天数
      compress: true       # 压缩旧文件
      local_time: true     # 使用本地时间

# 前端静态文件配置
web:
  enable: true
  # 静态文件路径映射（开发模式）
  # 格式: /ui/*filepath=./web/dist
  # 注意：使用 -tags embed 编译时此配置被忽略
  resource_mapping: "/ui/*filepath=./web/dist"

# pprof 性能分析
pprof:
  enable: true
  port: 6060

# 安全配置
security:
  requireAuth: false                    # 是否需要认证
  jwtSecretKey: "tpclaw-secret-key-change-in-production"
  jwtExpireTime: 24                     # JWT 过期时间（小时）
  jwtIssuer: "tpclaw"
  defaultUsername: "admin"
  users:
    admin: "admin"                      # 用户名: 密码

# 模型配置
models:
  default: "default"                    # 默认供应商名称
  providers:
    default:
      name: "智谱 Coding"
      base_url: "https://open.bigmodel.cn/api/coding/paas/v4"
      api_key: "${ZHIPU_API_KEY}"
      model: "glm-5"
      models:
        - name: "glm-5"
          alias: "default"              # 别名，可通过 alias 引用
        - name: "glm-4"
        - name: "glm-4-flash"

    zhipu:
      name: "智谱"
      base_url: "https://open.bigmodel.cn/api/paas/v4"
      api_key: "${ZHIPU_API_KEY}"
      model: "GLM-5"
      models:
        - name: "GLM-5"
          alias: "default"
        - name: "GLM-4-Plus"
        - name: "GLM-4-Flash"

    aliyun_bailian:
      name: "阿里云百炼"
      base_url: "https://dashscope.aliyuncs.com/compatible-mode/v1"
      api_key: "${ALIYUN_API_KEY}"
      model: "qwen-turbo"
      models:
        - name: "qwen-turbo"
        - name: "qwen-plus"
        - name: "qwen-max"

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

# 智能体配置
agents:
  defaults:
    default_id: "main"                  # 默认智能体 ID

    # 心跳配置
    heartbeat:
      interval: "30m"                   # 心跳间隔，0 表示关闭
      prompt: ""                        # 自定义提示词
      active_hours:                     # 激活时间段
        start: "09:00"
        end: "22:00"
      target: ""                        # 目标通道
      load_history: false               # 是否加载历史消息

    # 会话配置
    session:
      enabled: true
      storage_path: "sessions"
      max_messages: 100
      default_scope: "per_peer"         # per_peer, per_channel, global
      tool_call:
        save_tool_calls: true           # 保存工具调用记录
        keep_tool_calls_count: 5        # 保留最近工具调用数量
        max_tool_result_size: 2000      # 工具结果最大字符数

    # 会话压缩配置
    compaction:
      mode: "safeguard"                 # safeguard, auto, off
      keep_recent_count: 10
      target_tokens: 80000
      memory_flush: true

    # 全局技能目录
    global_skills_dir: "skills"

    # 媒体存储配置
    media:
      enable: true
      storage_path: "media"
      max_file_size: 52428800           # 50MB

  # 单独智能体配置（覆盖默认值）
  list:
    - id: "main"
      default: true
      model: "gpt-4"
    - id: "agent01"
      heartbeat:
        interval: "1h"

# 通道配置
channels:
  # API 通道（用于外部系统调用）
  api:
    enabled: true
    accounts:
      account01:
        name: "测试账号"
        enabled: true
        api_key: "your-api-key"
        dm_policy: "allow"              # allow, disabled
        group_policy: "allow"

  # 飞书通道
  feishu:
    enabled: true
    accounts:
      default:
        name: "默认飞书"
        enabled: true
        app_id: "${FEISHU_APP_ID}"
        app_secret: "${FEISHU_APP_SECRET}"
        encrypt_key: ""
        verifier: ""
        dm_policy: "allow"
        group_policy: "allow"

  # 钉钉通道
  dingtalk:
    enabled: false
    accounts:
      default:
        name: "默认钉钉"
        enabled: true
        app_key: "${DINGTALK_APP_KEY}"
        app_secret: "${DINGTALK_APP_SECRET}"
        token: ""
        aes_key: ""
        dm_policy: "allow"
        group_policy: "allow"

  # 企业微信通道
  wecom:
    enabled: false
    accounts:
      default:
        name: "默认企业微信"
        enabled: true
        corp_id: "${WECOM_CORP_ID}"
        secret: "${WECOM_SECRET}"
        agent_id: 100001
        encoding_aes_key: ""
        token: ""
        dm_policy: "allow"
        group_policy: "allow"

  # Telegram 通道
  telegram:
    enabled: false
    accounts:
      default:
        name: "默认Telegram"
        enabled: true
        bot_token: "${TELEGRAM_BOT_TOKEN}"
        dm_policy: "allow"
        group_policy: "allow"

# 绑定配置（通道与智能体的映射）
bindings:
  - agent_id: "main"
    match:
      default: true                     # 默认绑定
      channel: "feishu"
      account_id: "default"
```

## 配置项详解

### server 服务器配置

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `host` | string | `0.0.0.0` | 监听地址 |
| `port` | int | `9527` | 监听端口 |

### data 数据目录配置

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `root_dir` | string | `./` | 数据根目录 |
| `logs_dir` | string | `logs` | 日志目录 |

### logging 日志配置

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `level` | string | `info` | 日志级别：debug, info, warn, error |
| `format` | string | `console` | 日志格式：json, console |
| `development` | bool | `false` | 开发模式（彩色输出） |
| `encoding` | string | `utf-8` | 编码格式 |
| `output.stdout` | bool | `true` | 输出到标准输出 |
| `output.file.enabled` | bool | `true` | 输出到文件 |
| `output.file.path` | string | `logs/app.log` | 日志文件路径 |
| `output.file.max_size` | int | `100` | 单个文件最大 MB |
| `output.file.max_backups` | int | `30` | 保留旧文件数量 |
| `output.file.max_age` | int | `7` | 保留天数 |
| `output.file.compress` | bool | `true` | 压缩旧文件 |

### web 前端配置

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `enable` | bool | `true` | 是否启用前端静态文件服务 |
| `resource_mapping` | string | `/ui/*filepath=./web/dist` | 静态文件路径映射 |

### pprof 性能分析

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `enable` | bool | `true` | 是否启用 pprof |
| `port` | int | `6060` | pprof 服务端口 |

访问 `http://localhost:6060/debug/pprof/` 查看性能分析。

### security 安全配置

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `requireAuth` | bool | `false` | 是否需要认证 |
| `jwtSecretKey` | string | - | JWT 密钥（生产环境必须修改） |
| `jwtExpireTime` | int | `24` | JWT 过期时间（小时） |
| `jwtIssuer` | string | `tpclaw` | JWT 签发者 |
| `defaultUsername` | string | `admin` | 默认用户名 |
| `users` | map | - | 用户列表，格式：`用户名: 密码` |

### agents 智能体配置

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `defaults.default_id` | string | `main` | 默认智能体 ID |
| `defaults.heartbeat.interval` | duration | `30m` | 心跳间隔 |
| `defaults.heartbeat.active_hours.start` | string | - | 激活开始时间 |
| `defaults.heartbeat.active_hours.end` | string | - | 激活结束时间 |
| `defaults.session.enabled` | bool | `true` | 是否启用会话 |
| `defaults.session.default_scope` | string | `per_peer` | 会话作用域 |
| `defaults.compaction.mode` | string | `safeguard` | 压缩模式 |
| `defaults.media.enable` | bool | `true` | 是否启用媒体存储 |

### channels 通道配置

| 配置项 | 类型 | 说明 |
|--------|------|------|
| `<platform>.enabled` | bool | 是否启用该通道 |
| `<platform>.accounts` | map | 账号配置，支持多账号 |
| `accounts.<id>.name` | string | 账号名称 |
| `accounts.<id>.enabled` | bool | 是否启用该账号 |
| `accounts.<id>.dm_policy` | string | 私聊策略：allow, disabled |
| `accounts.<id>.group_policy` | string | 群聊策略：allow, disabled |

### bindings 绑定配置

| 配置项 | 类型 | 说明 |
|--------|------|------|
| `agent_id` | string | 智能体 ID |
| `match.default` | bool | 是否为默认绑定 |
| `match.channel` | string | 通道类型 |
| `match.account_id` | string | 账号 ID |
| `match.peer.kind` | string | 精细匹配类型：group, p2p |
| `match.peer.id` | string | 群组/用户 ID |

## 配置优先级

配置值的优先级从高到低：

1. 命令行参数
2. 环境变量
3. 配置文件
4. 默认值

## 敏感信息管理

### 使用环境变量

推荐将敏感信息存储在环境变量中：

```yaml
api_key: "${OPENAI_API_KEY}"
```

### 使用 .env 文件

创建 `.env` 文件（不要提交到版本控制）：

```bash
OPENAI_API_KEY=sk-xxx
ZHIPU_API_KEY=xxx.xxx
FEISHU_APP_ID=cli_xxx
FEISHU_APP_SECRET=xxx
```

### 使用密钥管理服务

生产环境推荐使用专业的密钥管理服务：
- HashiCorp Vault
- AWS Secrets Manager
- Azure Key Vault

## 配置验证

启动时 TPCLAW 会自动验证配置。如果配置有误会输出警告信息。

## 相关文档

- [模型配置](/guide/configuration/models) - 模型详细配置
- [通道配置](/guide/configuration/channels) - 通道详细配置
- [智能体配置](/guide/configuration/agents) - 智能体详细配置
- [安全配置](/guide/configuration/security) - 安全详细配置