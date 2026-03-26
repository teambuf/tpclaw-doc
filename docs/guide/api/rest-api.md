# REST API

TPCLAW 提供完整的 REST API 用于管理和使用智能体。

## 基础信息

- **基础 URL**: `http://localhost:9527/api/v1`
- **认证**: Bearer Token（当 `security.requireAuth` 为 true 时）
- **格式**: JSON

## 认证

当启用认证时，在请求头中携带 JWT Token：

```bash
curl -H "Authorization: Bearer your-jwt-token" \
  http://localhost:9527/api/v1/agents
```

## 通用响应格式

### 成功响应

```json
{
  "id": "main",
  "name": "TeamClaw",
  ...
}
```

### 分页响应

```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "size": 20
}
```

### 错误响应

```json
{
  "error": "Resource not found"
}
```

---

## 智能体 API

### 列出智能体

```http
GET /api/v1/agents
```

**查询参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `page` | int | 1 | 页码 |
| `size` | int | 20 | 每页数量 |

**响应示例：**

```json
{
  "data": [
    {
      "ruleChain": {
        "id": "main",
        "name": "TeamClaw"
      }
    }
  ],
  "total": 1,
  "page": 1,
  "size": 20
}
```

### 获取智能体

```http
GET /api/v1/agents/{agentId}
```

### 创建智能体

```http
POST /api/v1/agents
Content-Type: application/json

{
  "ruleChain": {
    "id": "my-agent",
    "name": "我的智能体"
  },
  "metadata": {
    "nodes": [...],
    "connections": [...]
  }
}
```

### 更新智能体

```http
PUT /api/v1/agents/{agentId}
Content-Type: application/json

{
  "ruleChain": {
    "id": "my-agent",
    "name": "更新后的名称"
  },
  "metadata": {...}
}
```

### 删除智能体

```http
DELETE /api/v1/agents/{agentId}
```

### 重载智能体

```http
POST /api/v1/agents/{agentId}/reload
```

---

## 智能体技能 API

### 列出智能体私有技能

```http
GET /api/v1/agents/{agentId}/skills
```

**查询参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `page` | int | 1 | 页码 |
| `size` | int | 20 | 每页数量 |

### 获取技能详情

```http
GET /api/v1/agents/{agentId}/skills/{name}
```

### 创建技能

```http
POST /api/v1/agents/{agentId}/skills
Content-Type: application/json

{
  "name": "my-skill",
  "description": "技能描述",
  "content": "# 技能内容\n\n..."
}
```

### 更新技能

```http
PUT /api/v1/agents/{agentId}/skills/{name}
Content-Type: application/json

{
  "description": "更新后的描述",
  "content": "..."
}
```

### 删除技能

```http
DELETE /api/v1/agents/{agentId}/skills/{name}
```

### 上传技能压缩包

```http
POST /api/v1/agents/{agentId}/skills/upload
Content-Type: multipart/form-data

file: skills.zip
```

---

## 智能体工作空间 API

### 列出工作空间文件

```http
GET /api/v1/agents/{agentId}/workspace/entries?path=/
```

**查询参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `path` | string | 子路径，默认根目录 |

**响应示例：**

```json
[
  {
    "name": "IDENTITY.md",
    "isDir": false,
    "size": 1024,
    "modTime": "2024-01-15T10:00:00Z"
  },
  {
    "name": "skills",
    "isDir": true
  }
]
```

### 获取文件内容

```http
GET /api/v1/agents/{agentId}/workspace/file?path=IDENTITY.md
```

**响应示例：**

```json
{
  "content": "# 身份\n\n## 名称\nTeamClaw\n..."
}
```

### 更新文件内容

```http
PUT /api/v1/agents/{agentId}/workspace/file?path=IDENTITY.md
Content-Type: application/json

{
  "content": "更新后的内容"
}
```

### 创建文件

```http
POST /api/v1/agents/{agentId}/workspace/files
Content-Type: application/json

{
  "path": "notes.md",
  "content": "# 笔记\n\n..."
}
```

### 创建目录

```http
POST /api/v1/agents/{agentId}/workspace/dirs
Content-Type: application/json

{
  "path": "memory"
}
```

### 删除文件或目录

```http
DELETE /api/v1/agents/{agentId}/workspace/entry?path=notes.md
```

### 重命名文件或目录

```http
PATCH /api/v1/agents/{agentId}/workspace/rename?path=old-name.md
Content-Type: application/json

{
  "newName": "new-name.md"
}
```

### 下载文件

```http
GET /api/v1/agents/{agentId}/workspace/download?path=file.pdf
```

---

## 规则链 API

### 列出规则链

```http
GET /api/v1/rules
```

**查询参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `agentId` | string | 智能体 ID |
| `category` | string | 分类过滤 |
| `loaded` | bool | 是否只返回已加载的规则链 |

### 获取规则链

```http
GET /api/v1/rules/{id}
```

### 创建规则链

```http
POST /api/v1/rules
Content-Type: application/json

{
  "ruleChain": {
    "id": "my-chain",
    "name": "我的规则链"
  },
  "metadata": {...}
}
```

### 更新规则链

```http
PUT /api/v1/rules/{id}
Content-Type: application/json

{...}
```

### 删除规则链

```http
DELETE /api/v1/rules/{id}
```

### 重载规则链

```http
POST /api/v1/rules/{id}/reload
```

### 智能体级别规则链

```http
GET /api/v1/agents/{agentId}/rules
GET /api/v1/agents/{agentId}/rules/{id}
POST /api/v1/agents/{agentId}/rules
PUT /api/v1/agents/{agentId}/rules/{id}
DELETE /api/v1/agents/{agentId}/rules/{id}
POST /api/v1/agents/{agentId}/rules/{id}/reload
```

---

## 定时任务 API

### 列出定时任务

```http
GET /api/v1/cron
```

**查询参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `agentId` | string | 智能体 ID |

### 获取定时任务

```http
GET /api/v1/cron/{id}
```

### 创建定时任务

```http
POST /api/v1/cron
Content-Type: application/json

{
  "name": "每日提醒",
  "schedule": "0 0 8 * * *",
  "message": "早上好！",
  "target": "main"
}
```

**字段说明：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `name` | string | 任务名称 |
| `schedule` | string | Cron 表达式（秒 分 时 日 月 周） |
| `message` | string | 任务消息 |
| `target` | string | 目标智能体 ID |

### 删除定时任务

```http
DELETE /api/v1/cron/{id}
```

### 启用/禁用定时任务

```http
PUT /api/v1/cron/{id}/toggle
Content-Type: application/json

{
  "disabled": true
}
```

### 智能体级别定时任务

```http
GET /api/v1/agents/{agentId}/cron
GET /api/v1/agents/{agentId}/cron/{id}
POST /api/v1/agents/{agentId}/cron
DELETE /api/v1/agents/{agentId}/cron/{id}
PUT /api/v1/agents/{agentId}/cron/{id}/toggle
```

---

## 技能 API（全局）

### 列出技能

```http
GET /api/v1/skills
```

**查询参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `agentId` | string | - | 智能体 ID |
| `scope` | string | all | 范围：all, global, personal |
| `page` | int | 1 | 页码 |
| `size` | int | 20 | 每页数量 |

### 获取技能详情

```http
GET /api/v1/skills/{name}
```

### 创建技能

```http
POST /api/v1/skills
Content-Type: application/json

{
  "name": "my-skill",
  "description": "技能描述",
  "content": "...",
  "scope": "global"
}
```

### 更新技能

```http
PUT /api/v1/skills/{name}
Content-Type: application/json

{...}
```

### 删除技能

```http
DELETE /api/v1/skills/{name}?scope=global
```

### 上传技能压缩包

```http
POST /api/v1/skills/upload
Content-Type: multipart/form-data

file: skills.zip
scope: global
```

### 复制技能

```http
POST /api/v1/skills/copy
Content-Type: application/json

{
  "name": "source-skill",
  "targetScope": "personal",
  "newName": "copied-skill"
}
```

---

## 会话 API

### 清除会话

```http
POST /api/v1/sessions/clear
Content-Type: application/json

{
  "agentId": "main",
  "sessionKey": "user-123",
  "channel": "default",
  "scope": "per_peer"
}
```

**响应示例：**

```json
{
  "success": true,
  "message": "Session cleared successfully"
}
```

---

## 配置 API

### 获取配置

```http
GET /api/v1/config
```

**响应示例：**

```json
{
  "server": {
    "host": "0.0.0.0",
    "port": 9527
  },
  "data": {
    "root_dir": "./",
    "logs_dir": "logs"
  },
  "models": {
    "default_provider": "default",
    "providers": {...}
  },
  "security": {
    "requireAuth": false,
    "users": {"admin": true}
  }
}
```

### 更新配置

```http
PUT /api/v1/config
Content-Type: application/json

{
  "server": {"port": 8080},
  "models": {...}
}
```

### 获取工具列表

```http
GET /api/v1/tools
```

### 获取工具表单定义

```http
GET /api/v1/tools/forms
```

### 获取智能体模板

```http
GET /api/v1/agent-template
```

---

## 模型配置 API

### 获取模型配置

```http
GET /api/v1/config/models
```

### 更新模型配置

```http
PUT /api/v1/config/models
Content-Type: application/json

{
  "model": "gpt-4",
  "api_key": "sk-xxx",
  "base_url": "https://api.openai.com/v1",
  "default": "openai"
}
```

### 获取供应商列表

```http
GET /api/v1/config/models/providers
```

**响应示例：**

```json
[
  {
    "id": "default",
    "name": "智谱 Coding",
    "base_url": "https://open.bigmodel.cn/api/coding/paas/v4",
    "model": "glm-5",
    "models": [
      {"name": "glm-5", "alias": "default"}
    ]
  }
]
```

### 添加供应商

```http
POST /api/v1/config/models/providers
Content-Type: application/json

{
  "id": "openai",
  "name": "OpenAI",
  "base_url": "https://api.openai.com/v1",
  "api_key": "sk-xxx",
  "model": "gpt-4",
  "models": [
    {"name": "gpt-4", "alias": "default"},
    {"name": "gpt-3.5-turbo"}
  ]
}
```

### 更新供应商

```http
PUT /api/v1/config/models/providers/{name}
Content-Type: application/json

{
  "name": "OpenAI GPT",
  "model": "gpt-4-turbo"
}
```

### 删除供应商

```http
DELETE /api/v1/config/models/providers/{name}
```

### 更新 API Key

```http
PUT /api/v1/config/models/providers/{name}/api-key
Content-Type: application/json

{
  "apiKey": "sk-new-key"
}
```

### 重载配置

```http
POST /api/v1/config/models/reload
```

---

## 通道配置 API

### 获取所有通道

```http
GET /api/v1/channels
```

**响应示例：**

```json
{
  "platforms": {
    "feishu": {
      "enabled": true,
      "accounts": {
        "default": {
          "id": "default",
          "name": "默认飞书",
          "enabled": true,
          "dmPolicy": "allow",
          "groupPolicy": "allow",
          "appId": "cli_xxx",
          "hasSecret": true
        }
      }
    }
  }
}
```

### 获取平台配置

```http
GET /api/v1/channels/{platform}
```

**支持的 platform：** `api`, `feishu`, `feishu_webhook`, `dingtalk`, `wecom`, `telegram`, `slack`

### 获取账号配置

```http
GET /api/v1/channels/{platform}/accounts/{accountId}
```

### 创建账号

```http
POST /api/v1/channels/{platform}/accounts
Content-Type: application/json

{
  "id": "account01",
  "name": "测试账号",
  "enabled": true,
  "dm_policy": "allow",
  "group_policy": "allow",
  "app_id": "cli_xxx",
  "app_secret": "xxx",
  "binding": {
    "agentId": "main",
    "match": {
      "default": true,
      "channel": "feishu"
    }
  }
}
```

### 更新账号

```http
PUT /api/v1/channels/{platform}/accounts/{accountId}
Content-Type: application/json

{...}
```

### 删除账号

```http
DELETE /api/v1/channels/{platform}/accounts/{accountId}
```

### 获取绑定配置

```http
GET /api/v1/bindings
```

**响应示例：**

```json
{
  "bindings": [
    {
      "agentId": "main",
      "match": {
        "default": true,
        "channel": "feishu",
        "accountId": "default"
      }
    }
  ]
}
```

### 更新绑定配置

```http
PUT /api/v1/bindings
Content-Type: application/json

{
  "bindings": [
    {
      "agentId": "main",
      "match": {
        "default": true,
        "channel": "feishu"
      }
    }
  ]
}
```

---

## 消息发送 API

### 发送文本消息

```http
POST /api/v1/channels/{platform}/send
Content-Type: application/json

{
  "chatId": "oc_xxx",
  "message": "Hello World",
  "accountId": "default"
}
```

### 发送图片消息

```http
POST /api/v1/channels/{platform}/send-image
Content-Type: application/json

{
  "chatId": "oc_xxx",
  "imagePath": "/path/to/image.png",
  "imageKey": "img_xxx"
}
```

### 发送文件消息

```http
POST /api/v1/channels/{platform}/send-file
Content-Type: application/json

{
  "chatId": "oc_xxx",
  "filePath": "/path/to/file.pdf",
  "fileName": "document.pdf",
  "fileKey": "file_xxx"
}
```

---

## Chat API（OpenAI 兼容）

### 对话补全

```http
POST /api/v1/chat/completions
Content-Type: application/json

{
  "model": "main",
  "messages": [
    {"role": "user", "content": "你好"}
  ],
  "stream": true
}
```

**参数说明：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `model` | string | 智能体 ID |
| `messages` | array | 消息列表 |
| `stream` | bool | 是否流式输出 |
| `sessionId` | string | 会话 ID |

---

## 认证 API

### 登录

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin"
}
```

**响应示例：**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expireAt": "2024-01-16T10:00:00Z"
}
```

---

## 健康检查

```http
GET /health
```

**响应：**

```
OK
```

---

## 相关文档

- [CLI 命令](/guide/api/cli) - 命令行工具
- [WebSocket API](/guide/api/websocket) - 实时通信
- [配置文件](/guide/configuration/config-file) - 配置说明