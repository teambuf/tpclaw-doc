# 企业微信通道

配置企业微信作为智能体的消息通道。

## 概述

企业微信是腾讯推出的企业协作平台，TPCLAW 支持通过企业微信应用接入智能体。

### 支持的功能

- ✅ 接收和发送消息
- ✅ 群聊消息
- ✅ 私聊消息
- ✅ 文件消息
- ✅ 图片消息
- ✅ 多账号支持

## 前置条件

1. 创建企业微信应用
2. 获取 CorpID、Secret 和 AgentId
3. 配置回调 URL
4. 设置可信域名

## 配置

### YAML 配置

```yaml
channels:
  wecom:
    enabled: true
    accounts:
      default:
        name: "默认企业微信"
        enabled: true
        corp_id: "xxx"               # 企业 ID
        secret: "xxx"                # 应用 Secret
        agent_id: 100001             # 应用 AgentId
        encoding_aes_key: ""         # 可选，消息加密 Key
        token: ""                    # 可选，回调验证 Token
        dm_policy: "allow"           # 私聊策略
        group_policy: "allow"        # 群聊策略
        allow_from: []               # 白名单
```

### 多账号配置

```yaml
channels:
  wecom:
    enabled: true
    accounts:
      default:
        name: "主企业微信应用"
        enabled: true
        corp_id: "xxx"
        secret: "xxx"
        agent_id: 100001
        dm_policy: "allow"
        group_policy: "allow"

      backup:
        name: "备用企业微信应用"
        enabled: false
        corp_id: "xxx"
        secret: "yyy"
        agent_id: 100002
        dm_policy: "disabled"
        group_policy: "allow"
```

## 企业微信管理后台配置

### 1. 创建应用

1. 登录 [企业微信管理后台](https://work.weixin.qq.com)
2. 进入「应用管理」→「自建」→「创建应用」
3. 记录 AgentId 和 Secret

### 2. 配置回调

**回调 URL**：
```
POST https://your-domain.com/api/v1/endpoint/wecom
```

### 3. 设置可信域名

在应用设置中添加可信域名。

## 消息发送

### 发送文本消息

```bash
curl -X POST http://localhost:9527/api/v1/channels/wecom/send \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "user_id",
    "message": "Hello from TPCLAW!"
  }'
```

### 发送图片消息

```bash
curl -X POST http://localhost:9527/api/v1/channels/wecom/send-image \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "user_id",
    "imagePath": "/path/to/image.png"
  }'
```

### 发送文件消息

```bash
curl -X POST http://localhost:9527/api/v1/channels/wecom/send-file \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "user_id",
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
      channel: "wecom"
      account_id: "default"
```

## 相关文档

- [通道配置](/guide/configuration/channels) - 通用通道配置
- [REST API](/guide/api/rest-api) - API 参考