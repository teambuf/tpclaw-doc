# 安全配置

配置 TPCLAW 的安全相关选项。

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
