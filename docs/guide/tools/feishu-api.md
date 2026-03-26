# feishu-api 技能

飞书 API 调用技能，用于发送消息、回复消息、上传/下载图片和文件、操作在线文档、管理日历等飞书对接场景。

## 概述

当需要主动回复用户、发送通知、处理用户发送的图片/文件、或操作飞书文档时使用此技能。

## 核心概念

| 概念 | 说明 | 获取位置 |
|------|------|----------|
| **app_id** | 应用唯一标识 | 开发者后台 > 凭证与基础信息 |
| **app_secret** | 应用凭证密钥 | 开发者后台 > 凭证与基础信息 |
| **tenant_key** | 租户密钥（多租户） | 事件请求头中获取 |
| **open_id** | 用户在应用内的唯一标识 | 事件中获取 |
| **union_id** | 用户在同一企业下的唯一标识 | 事件中获取 |
| **chat_id** | 会话/群聊 ID | 事件中获取 |
| **message_id** | 消息 ID | 事件中获取 |
| **access_token** | API 调用凭证（tenant_access_token） | 通过 app_id + app_secret 获取 |

## 通道上下文信息

当你在飞书通道与用户交流时，系统会自动注入以下通道信息到你的上下文中：

```json
{
  "type": "feishu",
  "platform": "feishu",
  "timestamp": 1234567890123,
  "chatId": "oc_xxx",
  "chatType": "p2p",
  "threadId": "",
  "messageId": "om_xxx",
  "userId": "xxx",
  "openId": "ou_xxx",
  "unionId": "on_xxx",
  "userName": "张三",
  "botId": "cli_xxx",
  "tenantKey": "xxx",
  "rootId": "",
  "parentId": "",
  "msgType": "image",
  "mediaItems": [
    {
      "type": "image",
      "key": "img_v2_xxx",
      "fileName": "screenshot.png"
    }
  ]
}
```

**字段说明：**

- `chatId`：会话 ID，用于发送新消息
- `messageId`：消息 ID，用于回复消息
- `chatType`：`p2p` 私聊，`group` 群聊
- `openId`：用户 OpenID，用于 @用户
- `tenantKey`：租户 Key（多租户场景必需）
- `msgType`：消息类型（text, image, file, audio, video, post 等）
- `mediaItems`：多媒体内容列表（当消息包含图片、文件等时）

## 调用流程

```
┌─────────────────────────────────────────────────────────────┐
│  1. 获取 tenant_access_token（使用 app_id + app_secret）     │
│                    ↓                                        │
│  2. 调用业务 API（携带 Authorization: Bearer {token}）       │
│                    ↓                                        │
│  3. 检查 code 处理响应                                       │
│     - code=0: 成功                                          │
│     - code=99991663: token 失效，重新获取                    │
│     - 其他: 根据错误码处理                                   │
└─────────────────────────────────────────────────────────────┘
```

## 认证（必须首先执行）

### 获取 tenant_access_token

**请求：**

```http
POST https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal
Content-Type: application/json

{
  "app_id": "cli_xxx",
  "app_secret": "xxx"
}
```

**响应：**

```json
{
  "code": 0,
  "msg": "ok",
  "tenant_access_token": "t-xxx",
  "expire": 7200
}
```

**重要规则：**

- tenant_access_token 有效期 7200 秒（2 小时）
- **必须缓存**，不可频繁调用
- 调用 API 时使用 Header：`Authorization: Bearer {tenant_access_token}`
- 多租户场景需要带上 Header：`X-Tenant-Key: {tenant_key}`

## 消息发送方式

### 1. 发送新消息（主动发送）

```http
POST https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=chat_id
Authorization: Bearer {ACCESS_TOKEN}
Content-Type: application/json

{
  "receive_id": "oc_xxx",
  "msg_type": "text",
  "content": "{\"text\":\"你好，这是主动发送的消息\"}"
}
```

**参数说明：**

| 参数 | 必须 | 说明 |
|------|------|------|
| receive_id_type | 是 | 接收者 ID 类型：`chat_id`、`open_id`、`user_id`、`union_id` |
| receive_id | 是 | 接收者 ID |
| msg_type | 是 | 消息类型：text/post/interactive/image/audio/media/file/sticker |
| content | 是 | 消息内容（JSON 字符串） |

### 2. 回复消息

```http
POST https://open.feishu.cn/open-apis/im/v1/messages/{message_id}/reply
Authorization: Bearer {ACCESS_TOKEN}
Content-Type: application/json

{
  "msg_type": "text",
  "content": "{\"text\":\"这是回复内容\"}"
}
```

### 3. 发送卡片消息（推荐）

卡片消息支持更丰富的交互和 Markdown 格式：

```json
{
  "msg_type": "interactive",
  "content": "{\"config\":{\"wide_screen_mode\":true},\"elements\":[{\"tag\":\"markdown\",\"content\":{\"tag\":\"lark_md\",\"content\":\"# 任务完成\\n> 状态：**成功**\\n\\n任务已执行完毕，请查看结果。\"}}]}"
}
```

## 消息类型速查

| 类型 | msg_type | 说明 | content 格式 |
|------|----------|------|-------------|
| 文本 | `text` | 纯文本 | `{"text":"内容"}` |
| 富文本 | `post` | 富文本（支持@人） | 见下方示例 |
| 卡片 | `interactive` | 交互卡片 | 见卡片消息 |
| 图片 | `image` | 图片 | `{"image_key":"img_xxx"}` |
| 文件 | `file` | 文件 | `{"file_key":"file_xxx","file_name":"xxx.pdf"}` |
| 音频 | `audio` | 音频 | `{"file_key":"file_xxx","duration":100}` |
| 视频 | `media` | 视频 | `{"file_key":"file_xxx","duration":100}` |

## 图片/文件管理

### 上传图片

```http
POST https://open.feishu.cn/open-apis/im/v1/images
Authorization: Bearer {ACCESS_TOKEN}
Content-Type: multipart/form-data

form-data:
- image_type: message
- image: [二进制图片文件]
```

**支持的图片格式：**

- 格式：jpg, jpeg, png, gif, bmp
- 大小：最大 30MB

### 下载图片

```http
GET https://open.feishu.cn/open-apis/im/v1/images/{image_key}?type=original
Authorization: Bearer {ACCESS_TOKEN}
```

### 上传文件

```http
POST https://open.feishu.cn/open-apis/im/v1/files
Authorization: Bearer {ACCESS_TOKEN}
Content-Type: multipart/form-data

form-data:
- file_type: stream
- file_name: 文件名（含扩展名）
- file: [二进制文件数据]
```

**文件限制：**

- 大小：最大 30MB
- 支持常见文件格式（pdf, doc, docx, xls, xlsx, ppt, pptx, zip 等）

## 常用场景

### 场景 1：长时间任务完成后通知用户

```bash
# 1. 获取 token
curl -X POST "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal" \
  -H "Content-Type: application/json" \
  -d '{"app_id":"cli_xxx","app_secret":"xxx"}'

# 2. 发送通知消息
curl -X POST "https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=chat_id" \
  -H "Authorization: Bearer t-xxx" \
  -H "X-Tenant-Key: {tenant_key}" \
  -H "Content-Type: application/json" \
  -d '{
    "receive_id": "oc_xxx",
    "msg_type": "interactive",
    "content": "{\"config\":{\"wide_screen_mode\":true},\"elements\":[{\"tag\":\"markdown\",\"content\":{\"tag\":\"lark_md\",\"content\":\"# ✅ 任务完成\\n\\n你的数据分析任务已完成，请查看附件。\"}}]}"
  }'
```

### 场景 2：下载用户发送的图片进行分析

当用户在飞书发送图片时，消息事件中包含 `image_key`。由于大模型需要**可访问的图片 URL** 才能识别图片，推荐使用 Base64 Data URL：

```bash
# 1. 下载图片并转换为 Base64
IMAGE_BASE64=$(curl -s -X GET "https://open.feishu.cn/open-apis/im/v1/images/img_v2_xxx?type=original" \
  -H "Authorization: Bearer t-xxx" | base64 -w 0)

# 2. 构造 Data URL（大模型可直接使用）
DATA_URL="data:image/png;base64,$IMAGE_BASE64"

# 3. 将 DATA_URL 传给大模型进行视觉分析
```

## 错误处理

### 常见错误码

| code | 含义 | 处理方式 |
|------|------|----------|
| 0 | 成功 | - |
| 99991663 | token 无效或过期 | 重新获取 token |
| 99991664 | 权限不足 | 检查应用权限配置 |
| 99991661 | 参数错误 | 检查请求参数 |
| 99991668 | 消息 ID 不存在 | 检查 message_id |
| 99991669 | 会话 ID 不存在 | 检查 chat_id |

## 频率限制

- **token 获取**：不能频繁调用，需要缓存
- **消息发送**：单个应用 100 次/分钟
- **API 调用**：不同接口有不同限制，详见官方文档

## 调用原则

1. **安全第一** - app_secret 和 token 不可泄露
2. **缓存 token** - 避免频繁获取 tenant_access_token
3. **检查 code** - 每次调用都要检查返回的 code
4. **处理失效** - 实现 token 失效时的自动刷新逻辑
5. **遵守限制** - 注意频率限制，避免被拦截

## 相关文档

- [message-send 技能](/guide/tools/message-send) - 消息发送
- [cron-task 技能](/guide/tools/cron-task) - 定时任务
- [飞书通道配置](/guide/channels/feishu) - 飞书通道配置
