# 安全配置

配置 TPCLAW 的安全相关选项。

## 用户认证

### 基础认证

```yaml
security:
  requireAuth: true
  jwtSecretKey: "your-secret-key"        # 生产环境必须修改
  jwtExpireTime: 24                       # JWT 过期时间（小时）
  jwtIssuer: "tpclaw"
  defaultUsername: "admin"
  users:
    admin: "admin-password"               # 管理员账户
    viewer: "viewer-password"             # 普通用户账户
```

### 用户角色

认证通过后，系统根据用户名自动分配角色：

| 角色 | 条件 | 权限 |
|------|------|------|
| `admin` | 用户名为 `admin` | 所有权限，包括技能上传、删除等管理操作 |
| `user` | 其他用户 | 普通权限，可使用对话、查看配置等 |

::: tip
只有 `admin` 用户可以执行技能上传、创建、更新、删除等全局管理操作。
:::

## API Key 认证

### 配置 API Key

```yaml
security:
  api_keys:
    - name: "admin"
      key: "${ADMIN_API_KEY}"
      roles: ["admin", "read", "write"]

    - name: "readonly"
      key: "${READONLY_API_KEY}"
      roles: ["read"]
```

### 使用 API Key

```bash
curl -H "Authorization: Bearer your-api-key" \
  http://localhost:9527/api/v1/agents
```

## 角色权限

| 角色 | 权限 |
|------|------|
| `admin` | 所有权限 |
| `read` | 只读权限 |
| `write` | 写入权限 |

## CORS 配置

```yaml
security:
  cors:
    enabled: true
    allowedOrigins:
      - "http://localhost:*"
      - "https://your-domain.com"
    allowedMethods:
      - "GET"
      - "POST"
      - "PUT"
      - "DELETE"
    allowedHeaders:
      - "Authorization"
      - "Content-Type"
```

## 限流配置

通过 `rate_limit` 配置防止 API 被滥用：

```yaml
security:
  rate_limit:
    enabled: true
    default:
      rps: 30                    # 默认每秒请求数
      burst: 60                  # 默认突发容量
    rules:
      auth:                      # 含 "auth" 的路径使用更严格的限流
        rps: 3
        burst: 5
```

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `enabled` | bool | `false` | 是否启用限流 |
| `default.rps` | float | `30` | 默认每秒请求数 |
| `default.burst` | int | `60` | 默认突发容量 |
| `rules` | map | - | 按路径关键字匹配的限流规则，key 为路径关键字 |

::: tip
`rules` 中的 key 是路径关键字，系统通过 `strings.Contains(path, key)` 匹配。例如 `auth` 会匹配 `/api/v1/auth/login` 和 `/api/v1/auth/token` 等路径。
:::

## 敏感信息管理

### 环境变量

```yaml
models:
  providers:
    openai:
      api_key: "${OPENAI_API_KEY}"
```

### .env 文件

```bash
OPENAI_API_KEY=sk-xxx
ADMIN_API_KEY=admin-xxx
```

## 最佳实践

1. **不要**将敏感信息提交到版本控制
2. **使用**环境变量存储密钥
3. **定期**轮换 API Key
4. **限制** API Key 的权限范围

## 相关文档
- [配置文件](/guide/configuration/config-file) - 主配置文件
