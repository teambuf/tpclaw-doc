# 通道配置

配置智能体的消息接入通道。TPCLAW 支持多种 IM 平台和通用接入方式。

## 通道类型

| 通道 | 类型 | 说明 |
|------|------|------|
| `api` | API | 外部系统调用接口 |
| `feishu` | IM | 飞书机器人（WebSocket 长连接） |
| `feishu_webhook` | IM | 飞书机器人（Webhook 推送） |
| `dingtalk` | IM | 钉钉机器人 |
| `wecom` | IM | 企业微信 |
| `telegram` | IM | Telegram Bot |
| `slack` | IM | Slack |
| `websocket` | 通用 | WebSocket 接入 |

## 配置结构

通道配置采用多账号结构，每个平台支持配置多个账号：

```yaml
channels:
  <platform>:
    enabled: true                    # 是否启用该平台
    domain: ""                       # 平台域名（私有化部署时使用）
    accounts:                        # 账号配置
      <account_id>:                  # 账号 ID（自定义）
        name: "账号名称"              # 显示名称
        enabled: true                # 是否启用该账号
        dm_policy: "allow"           # 私聊策略
        group_policy: "allow"        # 群聊策略
        allow_from: []               # 白名单
        # ... 平台特定字段
```

## 策略配置

每个账号支持配置私聊和群聊策略：

| 策略值 | 说明 |
|--------|------|
| `allow` | 允许所有消息 |
| `disabled` | 禁用，不处理任何消息 |

### 白名单配置

使用 `allow_from` 限制允许访问的用户或群组：

```yaml
channels:
  feishu:
    accounts:
      default:
        dm_policy: "allow"
        group_policy: "allow"
        allow_from:
          - "ou_xxx"    # 部门 ID
          - "on_xxx"    # 用户 ID
          - "oc_xxx"    # 群组 ID
```

## 绑定配置

绑定定义了通道与智能体的映射关系：

```yaml
bindings:
  - agent_id: "main"           # 智能体 ID
    match:
      default: true            # 是否为默认绑定
      channel: "feishu"        # 通道类型
      account_id: "default"    # 账号 ID
      peer:                    # 精细化匹配（可选）
        kind: "group"          # group 或 p2p
        id: "oc_xxx"           # 群组/用户 ID
```

### 绑定匹配规则

1. **默认绑定**：`default: true` 的绑定作为默认处理
2. **通道匹配**：按 `channel` 字段匹配平台
3. **账号匹配**：按 `account_id` 匹配具体账号
4. **精细化匹配**：通过 `peer` 指定具体群组或用户

## 完整配置示例

```yaml
channels:
  # API 通道（用于外部系统调用）
  api:
    enabled: true
    accounts:
      account01:
        name: "测试账号"
        enabled: true
        api_key: "your-api-key"
        dm_policy: "allow"
        group_policy: "allow"

  # 飞书通道
  feishu:
    enabled: true
    accounts:
      default:
        name: "默认飞书"
        enabled: true
        app_id: "cli_xxx"
        app_secret: "xxx"
        encrypt_key: ""
        verifier: ""
        dm_policy: "allow"
        group_policy: "allow"
      account02:
        name: "备用飞书"
        enabled: false
        app_id: "cli_yyy"
        app_secret: "yyy"
        dm_policy: "disabled"
        group_policy: "allow"

  # 钉钉通道
  dingtalk:
    enabled: true
    accounts:
      default:
        name: "默认钉钉"
        enabled: true
        app_key: "xxx"
        app_secret: "xxx"
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
        corp_id: "xxx"
        secret: "xxx"
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
        bot_token: "xxx"
        dm_policy: "allow"
        group_policy: "allow"

# 绑定配置
bindings:
  # 飞书默认绑定到主智能体
  - agent_id: "main"
    match:
      default: true
      channel: "feishu"
      account_id: "default"

  # 钉钉绑定到客服智能体
  - agent_id: "customer_service"
    match:
      channel: "dingtalk"
      account_id: "default"

  # 特定群组绑定到特定智能体
  - agent_id: "special_agent"
    match:
      channel: "feishu"
      peer:
        kind: "group"
        id: "oc_xxx"
```

## 各平台配置详解

### API 通道

用于外部系统通过 API 调用智能体：

```yaml
channels:
  api:
    enabled: true
    accounts:
      account01:
        name: "外部系统"
        enabled: true
        api_key: "your-api-key"
        dm_policy: "allow"
        group_policy: "allow"
```

调用方式：

```bash
curl -X POST http://localhost:9527/api/v1/chat/completions \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "main",
    "messages": [{"role": "user", "content": "你好"}]
  }'
```

### 飞书通道

```yaml
channels:
  feishu:
    enabled: true
    accounts:
      default:
        name: "飞书机器人"
        enabled: true
        app_id: "cli_xxx"           # 应用 ID
        app_secret: "xxx"           # 应用密钥
        encrypt_key: ""             # 加密 Key（可选）
        verifier: ""                # 验证 Token（可选）
        dm_policy: "allow"
        group_policy: "allow"
```

### 钉钉通道

```yaml
channels:
  dingtalk:
    enabled: true
    accounts:
      default:
        name: "钉钉机器人"
        enabled: true
        app_key: "xxx"              # 应用的 AppKey
        app_secret: "xxx"           # 应用的 AppSecret
        token: ""                   # 回调 Token（可选）
        aes_key: ""                 # 加密 AES Key（可选）
        dm_policy: "allow"
        group_policy: "allow"
```

### 企业微信通道

```yaml
channels:
  wecom:
    enabled: true
    accounts:
      default:
        name: "企业微信机器人"
        enabled: true
        corp_id: "xxx"              # 企业 ID
        secret: "xxx"               # 应用 Secret
        agent_id: 100001            # 应用 AgentId
        encoding_aes_key: ""        # 加密 Key（可选）
        token: ""                   # 回调 Token（可选）
        dm_policy: "allow"
        group_policy: "allow"
```

### Telegram 通道

```yaml
channels:
  telegram:
    enabled: true
    accounts:
      default:
        name: "Telegram Bot"
        enabled: true
        bot_token: "xxx"            # Bot Token
        dm_policy: "allow"
        group_policy: "allow"
```

## 账号配置字段

### 通用字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | 是 | 账号显示名称 |
| `enabled` | bool | 是 | 是否启用 |
| `dm_policy` | string | 是 | 私聊策略：allow, disabled |
| `group_policy` | string | 是 | 群聊策略：allow, disabled |
| `allow_from` | []string | 否 | 白名单（用户/群组 ID） |

### 飞书字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `app_id` | string | 是 | 应用 ID |
| `app_secret` | string | 是 | 应用密钥 |
| `encrypt_key` | string | 否 | 消息加密 Key |
| `verifier` | string | 否 | 验证 Token |

### 钉钉字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `app_key` | string | 是 | 应用 AppKey |
| `app_secret` | string | 是 | 应用 AppSecret |
| `token` | string | 否 | 回调验证 Token |
| `aes_key` | string | 否 | 消息加密 Key |

### 企业微信字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `corp_id` | string | 是 | 企业 ID |
| `secret` | string | 是 | 应用 Secret |
| `agent_id` | int | 是 | 应用 AgentId |
| `encoding_aes_key` | string | 否 | 消息加密 Key |
| `token` | string | 否 | 回调验证 Token |

### Telegram 字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `bot_token` | string | 是 | Bot Token |

### API 通道字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `api_key` | string | 是 | API 密钥 |

## 通过 API 管理

### 获取通道配置

```bash
GET /api/v1/channels
```

### 获取平台配置

```bash
GET /api/v1/channels/feishu
```

### 创建账号

```bash
POST /api/v1/channels/feishu/accounts
Content-Type: application/json

{
  "id": "account01",
  "name": "新账号",
  "enabled": true,
  "app_id": "cli_xxx",
  "app_secret": "xxx",
  "dm_policy": "allow",
  "group_policy": "allow"
}
```

### 更新账号

```bash
PUT /api/v1/channels/feishu/accounts/account01
Content-Type: application/json

{
  "name": "更新后的名称",
  "enabled": true
}
```

### 删除账号

```bash
DELETE /api/v1/channels/feishu/accounts/account01
```

### 发送消息

```bash
POST /api/v1/channels/feishu/send
Content-Type: application/json

{
  "chatId": "oc_xxx",
  "message": "Hello World"
}
```

## 相关文档

- [飞书通道](/guide/channels/feishu) - 飞书详细配置
- [钉钉通道](/guide/channels/dingtalk) - 钉钉详细配置
- [企业微信](/guide/channels/wecom) - 企业微信配置
- [Telegram](/guide/channels/telegram) - Telegram 配置
- [WebSocket](/guide/channels/websocket) - WebSocket 配置
- [API 通道](/guide/channels/api) - API 通道配置
- [REST API](/guide/api/rest-api) - API 参考