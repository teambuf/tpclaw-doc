# Telegram 通道

配置 Telegram Bot 作为智能体的消息通道。

## 概述

Telegram 是一款流行的即时通讯软件，TPCLAW 支持通过 Telegram Bot 接入智能体。

### 支持的功能

- ✅ 接收和发送消息
- ✅ 群聊消息
- ✅ 私聊消息
- ✅ 文件消息
- ✅ 图片消息
- ✅ 多账号支持

## 前置条件

1. 创建 Telegram Bot
2. 获取 Bot Token

## 创建 Telegram Bot

1. 在 Telegram 中搜索 `@BotFather`
2. 发送 `/newbot` 命令
3. 按提示设置 Bot 名称
4. 记录返回的 Bot Token（格式：`123456789:ABCdefGHIjklMNOpqrsTUVwxyz`）

## 配置

### YAML 配置

```yaml
channels:
  telegram:
    enabled: true
    accounts:
      default:
        name: "默认Telegram Bot"
        enabled: true
        bot_token: "123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
        dm_policy: "allow"           # 私聊策略
        group_policy: "allow"        # 群聊策略
        allow_from: []               # 白名单
```

### 多账号配置

```yaml
channels:
  telegram:
    enabled: true
    accounts:
      default:
        name: "主 Telegram Bot"
        enabled: true
        bot_token: "123456789:ABC..."
        dm_policy: "allow"
        group_policy: "allow"

      backup:
        name: "备用 Telegram Bot"
        enabled: false
        bot_token: "987654321:XYZ..."
        dm_policy: "disabled"
        group_policy: "allow"
```

## Webhook 配置

TPCLAW 使用 Webhook 模式接收 Telegram 消息。

### 设置 Webhook

Telegram 会自动将消息推送到配置的 Webhook 地址：

```
POST https://your-domain.com/api/v1/endpoint/telegram
```

## 消息发送

### 发送文本消息

```bash
curl -X POST http://localhost:9527/api/v1/channels/telegram/send \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "123456789",
    "message": "Hello from TPCLAW!"
  }'
```

### 发送图片消息

```bash
curl -X POST http://localhost:9527/api/v1/channels/telegram/send-image \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "123456789",
    "imagePath": "/path/to/image.png"
  }'
```

### 发送文件消息

```bash
curl -X POST http://localhost:9527/api/v1/channels/telegram/send-file \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "123456789",
    "filePath": "/path/to/file.pdf",
    "fileName": "document.pdf"
  }'
```

## 绑定配置

```yaml
bindings:
  - agent_id: "main"
    match:
      default: true
      channel: "telegram"
      account_id: "default"
```

## 群聊配置

### 将 Bot 添加到群组

1. 在群组设置中点击「添加成员」
2. 搜索并选择你的 Bot
3. Bot 会自动接收群组消息

### 群聊策略

```yaml
channels:
  telegram:
    accounts:
      default:
        group_policy: "allow"  # 允许群聊消息
```

## 相关文档

- [通道配置](/guide/configuration/channels) - 通用通道配置
- [REST API](/guide/api/rest-api) - API 参考