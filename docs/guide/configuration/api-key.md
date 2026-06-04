# 认证配置

本文档介绍如何配置 TpClaw 的认证凭据，包括登录认证和 API Key 管理。

## 认证机制

TpClaw 使用两种认证方式：

| 方式 | 适用场景 | 认证方式 |
|------|----------|----------|
| 用户登录 | Web 界面使用 | 用户名 + 密码 → JWT Token |
| API Key | 外部系统集成 | Bearer Token |

## 用户认证

### 登录

通过 Web 界面或 API 登录：

```bash
# API 登录获取 JWT Token
curl -X POST http://localhost:9527/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "your-password"}'
```

返回 JWT Token，后续请求通过 `Authorization: Bearer <token>` 携带。

### 获取 API Key

登录后，可以通过 API 获取或重新生成 API Key：

```bash
# 获取当前 API Key（需 JWT 认证）
curl -H "Authorization: Bearer <jwt-token>" \
  http://localhost:9527/api/v1/auth/api-key

# 重新生成 API Key
curl -X POST -H "Authorization: Bearer <jwt-token>" \
  http://localhost:9527/api/v1/auth/api-key
```

### 修改密码

```bash
curl -X PUT http://localhost:9527/api/v1/auth/password \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"oldPassword": "old", "newPassword": "new"}'
```

## 配置安全设置

在 `config.yaml` 中配置安全相关选项：

```yaml
security:
  # 是否需要认证（默认 false）
  requireAuth: true

  # 用户配置，格式："密码" 或 "密码:APIKey"
  users:
    admin: "admin!@#"          # 仅密码
    # admin: "admin!@#:sk_xxx"  # 密码 + API Key
```

> 默认用户名为 `admin`，默认密码为 `admin!@#`，请在生产环境中及时修改。

## API 通道认证

API 通道支持通过账户配置进行认证，用于外部系统直接调用聊天接口：

```yaml
channels:
  api:
    enabled: true
    accounts:
      my-app:
        api_key: "sk-your-secret-key"
        description: "我的应用"
```

配置后，可以通过 API Key 直接调用聊天接口：

```bash
# 通过 API Key 调用 OpenAI 兼容接口
curl -X POST http://localhost:9527/api/v1/chat/completions \
  -H "Authorization: Bearer sk-your-secret-key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "main",
    "messages": [{"role": "user", "content": "你好"}]
  }'
```

## CLI 认证

CLI 命令行工具自动按以下优先级查找认证凭据：

1. 环境变量 `TPCLAW_API_KEY`
2. `channels.api.accounts` 中第一个启用的 API Key
3. 使用用户名密码登录获取 JWT Token（缓存到本地文件）

```bash
# 通过环境变量设置 API Key
export TPCLAW_API_KEY="sk-your-secret-key"

# 或在配置文件中设置
tpclaw config set channels.api.accounts.my-app.api_key "sk-your-secret-key"
```

## 安全最佳实践

### 1. 生产环境启用认证

```yaml
security:
  requireAuth: true
  users:
    admin: "strong-password-here"
```

### 2. 使用环境变量

避免在配置文件中硬编码敏感信息，使用环境变量替换：

```yaml
security:
  users:
    admin: "${ADMIN_PASSWORD}"
```

### 3. 限制 API 通道访问

为不同应用创建不同的 API Key：

```yaml
channels:
  api:
    accounts:
      app-a:
        api_key: "sk-key-for-app-a"
      app-b:
        api_key: "sk-key-for-app-b"
```

## 相关文档

- [配置文件](./config-file) - 主配置文件说明
- [安全配置](./security) - 安全相关配置
- [REST API](/guide/api/rest-api) - API 接口文档
- [快速入门](/guide/getting-started/quickstart) - 快速上手指南
