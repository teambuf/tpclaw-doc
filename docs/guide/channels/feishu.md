# 飞书通道

配置飞书（Lark）作为智能体的消息通道。

## 概述

飞书是字节跳动推出的企业协作平台，TPCLAW 支持通过飞书机器人接入智能体。

### 支持的功能

- ✅ 接收和发送消息
- ✅ 消息卡片
- ✅ 富文本消息
- ✅ 群聊消息
- ✅ 私聊消息
- ✅ 文件上传下载
- ✅ 图片消息
- ✅ 多账号支持

## 前置条件

1. 创建飞书开放平台应用
2. 获取 App ID 和 App Secret
3. 配置事件订阅
4. 发布应用版本

## 配置

### YAML 配置

```yaml
channels:
  feishu:
    enabled: true
    accounts:
      default:
        name: "默认飞书"
        enabled: true
        app_id: "cli_xxxxxxxxxxxx"
        app_secret: "xxxxxxxxxxxxxxxx"
        encrypt_key: ""              # 可选，用于消息加密
        verifier: ""                 # 可选，用于消息验证
        dm_policy: "allow"           # 私聊策略
        group_policy: "allow"        # 群聊策略
        allow_from: []               # 白名单
```

### 多账号配置

```yaml
channels:
  feishu:
    enabled: true
    accounts:
      # 主账号
      default:
        name: "主飞书机器人"
        enabled: true
        app_id: "cli_xxx"
        app_secret: "xxx"
        dm_policy: "allow"
        group_policy: "allow"

      # 备用账号
      backup:
        name: "备用飞书机器人"
        enabled: false
        app_id: "cli_yyy"
        app_secret: "yyy"
        dm_policy: "disabled"
        group_policy: "allow"
```

### 策略配置

| 策略值 | 说明 |
|--------|------|
| `allow` | 允许所有消息 |
| `disabled` | 禁用，不处理任何消息 |

### 白名单配置

```yaml
channels:
  feishu:
    accounts:
      default:
        dm_policy: "allow"
        group_policy: "allow"
        allow_from:
          - "ou_xxxxxxxxxxxx"  # 允许的部门 ID
          - "on_xxxxxxxxxxxx"  # 允许的用户 ID
          - "oc_xxxxxxxxxxxx"  # 允许的群组 ID
```

## 飞书开放平台配置

### 1. 创建应用

1. 访问 [飞书开放平台](https://open.feishu.cn)
2. 创建企业自建应用
3. 记录 App ID 和 App Secret

### 2. 配置权限

启用以下权限：

| 权限 | 说明 |
|------|------|
| `im:message` | 获取与发送消息 |
| `im:message:send_as_bot` | 以应用身份发消息 |
| `im:chat` | 获取群组信息 |
| `im:chat:readonly` | 读取群组信息 |
| `contact:user.base:readonly` | 读取用户基本信息 |

### 3. 配置事件订阅

**请求地址**：
```
POST https://your-domain.com/api/v1/endpoint/feishu
```

**订阅事件**：
- `im.message.receive_v1` - 接收消息

### 4. 发布应用

1. 配置完成后提交审核
2. 审核通过后发布应用
3. 将应用添加到目标群组

## 消息格式

### 接收消息

```json
{
  "event": {
    "type": "message",
    "msg_type": "text",
    "content": "你好",
    "message_id": "om_xxxxxxxxxxxx",
    "chat_id": "oc_xxxxxxxxxxxx",
    "sender": {
      "sender_id": {
        "union_id": "on_xxxxxxxxxxxx",
        "user_id": "xxxxxxxxxxxx"
      },
      "sender_type": "user"
    }
  }
}
```

### 发送文本消息

通过 API 发送：

```bash
curl -X POST http://localhost:9527/api/v1/channels/feishu/send \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "oc_xxx",
    "message": "Hello from TPCLAW!"
  }'
```

### 发送图片消息

```bash
curl -X POST http://localhost:9527/api/v1/channels/feishu/send-image \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "oc_xxx",
    "imagePath": "/path/to/image.png"
  }'
```

### 发送文件消息

```bash
curl -X POST http://localhost:9527/api/v1/channels/feishu/send-file \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "oc_xxx",
    "filePath": "/path/to/file.pdf",
    "fileName": "document.pdf"
  }'
```

## 绑定配置

将飞书通道绑定到智能体：

```yaml
bindings:
  - agent_id: "main"
    match:
      default: true
      channel: "feishu"
      account_id: "default"

  # 特定群组绑定到特定智能体
  - agent_id: "customer_service"
    match:
      channel: "feishu"
      account_id: "default"
      peer:
        kind: "group"
        id: "oc_xxx"
```

## 安全配置

### 消息加密

启用消息加密保护通信安全：

```yaml
channels:
  feishu:
    accounts:
      default:
        encrypt_key: "your-32-char-encrypt-key"
```

### 访问控制

限制允许访问的用户/部门：

```yaml
channels:
  feishu:
    accounts:
      default:
        dm_policy: "allow"
        group_policy: "allow"
        allow_from:
          - "ou_xxxxxxxxxxxx"  # 部门 ID
          - "on_xxxxxxxxxxxx"  # 用户 ID
```

## 故障排查

### 消息未收到

1. 检查事件订阅是否正确
2. 确认应用已发布并添加到群组
3. 检查网络连通性
4. 查看服务日志

### 消息发送失败

1. 检查权限配置
2. 确认 chat_id 正确
3. 查看服务日志

### 签名验证失败

1. 检查 App Secret 是否正确
2. 确认时间同步

## 相关文档

- [通道配置](/guide/configuration/channels) - 通用通道配置
- [绑定规则](/guide/configuration/channels#bindings) - 智能体绑定
- [REST API](/guide/api/rest-api) - API 参考