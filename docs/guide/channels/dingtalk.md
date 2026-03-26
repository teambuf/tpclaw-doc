# 钉钉通道

配置钉钉作为智能体的消息通道。

## 概述

钉钉是阿里巴巴推出的企业协作平台，TPCLAW 支持通过钉钉机器人接入智能体。

### 支持的功能

- ✅ 接收和发送消息
- ✅ 群聊消息
- ✅ 私聊消息
- ✅ 文件消息
- ✅ 图片消息
- ✅ 多账号支持

## 前置条件

1. 创建钉钉开放平台应用
2. 获取 AppKey 和 AppSecret
3. 配置事件订阅
4. 发布应用

## 配置

### YAML 配置

```yaml
channels:
  dingtalk:
    enabled: true
    accounts:
      default:
        name: "默认钉钉"
        enabled: true
        app_key: "xxx"
        app_secret: "xxx"
        token: ""                    # 可选，回调验证 Token
        aes_key: ""                  # 可选，消息加密 Key
        dm_policy: "allow"           # 私聊策略
        group_policy: "allow"        # 群聊策略
        allow_from: []               # 白名单
```

### 多账号配置

```yaml
channels:
  dingtalk:
    enabled: true
    accounts:
      default:
        name: "主钉钉机器人"
        enabled: true
        app_key: "xxx"
        app_secret: "xxx"
        dm_policy: "allow"
        group_policy: "allow"

      backup:
        name: "备用钉钉机器人"
        enabled: false
        app_key: "yyy"
        app_secret: "yyy"
        dm_policy: "disabled"
        group_policy: "allow"
```

## 钉钉开放平台配置

### 1. 创建应用

1. 访问 [钉钉开放平台](https://open.dingtalk.com)
2. 创建企业内部应用
3. 记录 AppKey 和 AppSecret

### 2. 配置权限

启用以下权限：

| 权限 | 说明 |
|------|------|
| `qyapi_get_chat` | 获取群组信息 |
| `qyapi_get_user` | 获取用户信息 |
| `qyapi_send_message` | 发送消息 |

### 3. 配置事件订阅

**请求地址**：
```
POST https://your-domain.com/api/v1/endpoint/dingtalk
```

## 消息发送

### 发送文本消息

```bash
curl -X POST http://localhost:9527/api/v1/channels/dingtalk/send \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "cid_xxx",
    "message": "Hello from TPCLAW!"
  }'
```

### 发送图片消息

```bash
curl -X POST http://localhost:9527/api/v1/channels/dingtalk/send-image \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "cid_xxx",
    "imagePath": "/path/to/image.png"
  }'
```

### 发送文件消息

```bash
curl -X POST http://localhost:9527/api/v1/channels/dingtalk/send-file \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "cid_xxx",
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
      channel: "dingtalk"
      account_id: "default"
```

## 相关文档

- [通道配置](/guide/configuration/channels) - 通用通道配置
- [REST API](/guide/api/rest-api) - API 参考