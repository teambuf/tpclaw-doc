# 配置 API Key

本文档介绍如何配置和管理 TpClaw 的 API Key，包括认证机制、配置方式以及安全最佳实践。

## 概述

TpClaw 使用 API Key 进行身份验证和授权。API Key 用于：

- 调用 REST API 时的身份验证
- SDK 客户端的认证
- Webhook 回调的签名验证
- 访问控制和权限管理

## 获取 API Key

### 方式一：命令行生成

```bash
# 生成新的 API Key
tpclaw api-key generate

# 输出示例:
# API Key: tpclaw_sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# 警告: 请妥善保管此密钥，关闭后将无法再次查看
```

### 方式二：配置文件预置

在首次启动时，TpClaw 会自动生成 API Key 并写入配置文件：

**Windows:**
```bash
# 双击 tpclaw.exe 启动服务
```

**Linux:**
```bash
# 启动服务
tpclaw service start

# 查看生成的 API Key
tpclaw config get api.key
```

### 方式三：自行设置

您也可以使用自定义的 API Key：

```bash
# 通过命令行设置
tpclaw config set api.key "your-custom-api-key"

# 或直接编辑配置文件
```

## 配置方式

### 方式一：配置文件

创建或编辑配置文件 `~/.tpclaw/config.yaml`：

```yaml
# TpClaw 配置文件

api:
  # 直接设置 API Key（不推荐用于生产环境）
  key: "tpclaw_sk_your-api-key-here"

  # 或从环境变量读取（推荐）
  key_env: "TPCLAW_API_KEY"

  # 多 API Key 支持
  keys:
    - name: "admin"
      key: "tpclaw_sk_admin_key"
      permissions: ["read", "write", "admin"]
    - name: "readonly"
      key: "tpclaw_sk_readonly_key"
      permissions: ["read"]

server:
  host: 0.0.0.0
  port: 8080
```

### 方式二：环境变量

使用环境变量是最安全的配置方式：

```bash
# Linux/macOS
export TPCLAW_API_KEY="tpclaw_sk_your-api-key-here"

# Windows PowerShell
$env:TPCLAW_API_KEY="tpclaw_sk_your-api-key-here"

# Windows CMD
set TPCLAW_API_KEY=tpclaw_sk_your-api-key-here
```

在配置文件中引用环境变量：

```yaml
api:
  key_env: "TPCLAW_API_KEY"
```

### 方式三：命令行参数

**Windows:**
通过双击 `tpclaw.exe` 启动后，在 Web 界面中配置。

**Linux:**
```bash
# 启动时指定 API Key
tpclaw service start --api-key "tpclaw_sk_your-api-key-here"

# 或指定环境变量名
tpclaw service start --api-key-env "TPCLAW_API_KEY"
```

### 方式四：Kubernetes Secret

```yaml
# secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: tpclaw-secrets
type: Opaque
stringData:
  api-key: tpclaw_sk_your-api-key-here
---
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: tpclaw
spec:
  template:
    spec:
      containers:
        - name: tpclaw
          image: rulego/tpclaw:latest
          env:
            - name: TPCLAW_API_KEY
              valueFrom:
                secretKeyRef:
                  name: tpclaw-secrets
                  key: api-key
```

## 使用 API Key

### HTTP 请求

在 HTTP 请求头中携带 API Key：

```bash
# 使用 Authorization 头（推荐）
curl -H "Authorization: Bearer tpclaw_sk_your-api-key-here" \
  http://localhost:9527/api/v1/tasks

# 使用 X-API-Key 头
curl -H "X-API-Key: tpclaw_sk_your-api-key-here" \
  http://localhost:9527/api/v1/tasks
```

### SDK 配置

**Go SDK:**

```go
client, err := tpclaw.NewClient(tpclaw.Config{
    BaseURL: "http://localhost:9527",
    APIKey:  "tpclaw_sk_your-api-key-here",
})
```

**Node.js SDK:**

```javascript
const client = new TpClawClient({
    baseURL: 'http://localhost:9527',
    apiKey: 'tpclaw_sk_your-api-key-here'
});
```

**Python SDK:**

```python
client = TpClawClient(
    base_url='http://localhost:9527',
    api_key='tpclaw_sk_your-api-key-here'
)
```

## API Key 管理

### 查看 API Key 信息

```bash
# 查看当前配置的 API Key 信息（部分隐藏）
tpclaw api-key info

# 输出示例:
# API Key: tpclaw_sk_****...****xxxx
# Created: 2024-01-15 10:00:00
# Expires: Never
# Permissions: read, write
```

### 列出所有 API Key

```bash
# 列出所有已配置的 API Key
tpclaw api-key list

# 输出示例:
# NAME       KEY (部分)           PERMISSIONS      CREATED
# admin      tpclaw_sk_***xxxx    read,write,admin 2024-01-15
# readonly   tpclaw_sk_***yyyy    read             2024-01-16
```

### 轮换 API Key

定期轮换 API Key 是安全最佳实践：

```bash
# 生成新的 API Key
NEW_KEY=$(tpclaw api-key generate --output json | jq -r '.key')

# 更新配置
tpclaw config set api.key "$NEW_KEY"

# 重启服务
tpclaw restart
```

### 撤销 API Key

```bash
# 撤销指定的 API Key
tpclaw api-key revoke "tpclaw_sk_xxxx"

# 撤销所有 API Key 并重新生成
tpclaw api-key revoke --all
tpclaw api-key generate
```

## 权限配置

TpClaw 支持基于 API Key 的权限控制：

```yaml
api:
  keys:
    # 管理员密钥 - 完全访问权限
    - name: "admin-key"
      key: "tpclaw_sk_admin_xxxx"
      permissions:
        - read      # 读取资源
        - write     # 创建/更新资源
        - delete    # 删除资源
        - admin     # 管理操作

    # 只读密钥 - 仅读取权限
    - name: "readonly-key"
      key: "tpclaw_sk_readonly_xxxx"
      permissions:
        - read

    # 任务执行密钥 - 特定权限
    - name: "executor-key"
      key: "tpclaw_sk_executor_xxxx"
      permissions:
        - read
        - task:execute
        - task:create
```

### 权限说明

| 权限 | 说明 |
|------|------|
| `read` | 读取所有资源 |
| `write` | 创建和更新资源 |
| `delete` | 删除资源 |
| `admin` | 管理操作（密钥管理、配置等） |
| `task:execute` | 执行任务 |
| `task:create` | 创建任务 |
| `task:cancel` | 取消任务 |

## 安全最佳实践

### 1. 使用环境变量

避免在配置文件中硬编码 API Key：

```yaml
# 推荐
api:
  key_env: "TPCLAW_API_KEY"

# 不推荐
api:
  key: "tpclaw_sk_hardcoded_key"
```

### 2. 限制 API Key 权限

遵循最小权限原则，为不同用途创建不同权限的 API Key：

```bash
# 只读操作使用只读密钥
tpclaw api-key generate --name "readonly" --permissions "read"

# 任务执行使用专用密钥
tpclaw api-key generate --name "executor" --permissions "read,task:execute"
```

### 3. 定期轮换密钥

```bash
# 建议每 90 天轮换一次
# 可设置自动提醒
tpclaw api-key generate --expires 90d
```

### 4. 监控 API Key 使用

```bash
# 查看密钥使用日志
tpclaw logs --filter "api_key"

# 查看异常使用
tpclaw audit --suspicious
```

### 5. 不要在日志中暴露

```yaml
logging:
  # 过滤敏感信息
  redact:
    - "api_key"
    - "authorization"
```

### 6. 使用 HTTPS

生产环境务必使用 HTTPS：

```yaml
server:
  tls:
    enabled: true
    cert: /path/to/cert.pem
    key: /path/to/key.pem
```

### 7. IP 白名单（可选）

```yaml
api:
  ip_whitelist:
    - "192.168.1.0/24"
    - "10.0.0.0/8"
```

## 多环境配置

### 开发环境

```yaml
# ~/.tpclaw/config.dev.yaml
api:
  key_env: "TPCLAW_DEV_API_KEY"
logging:
  level: debug
```

### 生产环境

```yaml
# ~/.tpclaw/config.prod.yaml
api:
  key_env: "TPCLAW_PROD_API_KEY"
logging:
  level: warn
server:
  tls:
    enabled: true
```

### 切换环境

**Windows:**
通过双击 `tpclaw.exe` 启动，配置文件会自动加载。

**Linux:**
```bash
# 使用开发配置
tpclaw service start --config ~/.tpclaw/config.dev.yaml

# 使用生产配置
tpclaw service start --config ~/.tpclaw/config.prod.yaml

# 通过环境变量切换
export TPCLAW_ENV=production
tpclaw service start
```

## 故障排查

### API Key 无效

```bash
# 验证 API Key 格式
tpclaw api-key validate "tpclaw_sk_xxxx"

# 检查 API Key 是否存在
tpclaw api-key list | grep "xxxx"
```

### 权限不足

```bash
# 检查 API Key 权限
tpclaw api-key info "tpclaw_sk_xxxx"

# 添加权限
tpclaw api-key update "tpclaw_sk_xxxx" --add-permission "write"
```

### 请求被拒绝

```bash
# 检查 IP 白名单配置
tpclaw config get api.ip_whitelist

# 查看访问日志
tpclaw logs --filter "401 OR 403"
```

## 相关文档

- [环境要求](./requirements.md)
- [安装指南](./installation.md)
- [快速入门](./quickstart.md)
- [配置说明](/guide/configuration/config-file)
