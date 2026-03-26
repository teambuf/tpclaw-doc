# CLI 命令参考

TPCLAW 提供完整的命令行工具，用于管理智能体、配置、定时任务、消息和系统服务。

## 安装

```bash
# 编译安装
go build -o tpclaw ./cmd/cli

# 或直接运行
go run ./cmd/cli [command]
```

## 全局选项

| 选项 | 默认值 | 说明 |
|------|--------|------|
| `--config` / `-c` | `~/.tpclaw/config.yaml` | 配置文件路径 |
| `--port` / `-p` | `9527` | 服务端口 |
| `--daemon` / `-d` | `false` | 后台运行模式 |

## 命令概览

```
tpclaw
├── [默认]          # 无子命令时启动服务
├── start           # 启动服务
├── version         # 显示版本信息
├── config          # 配置管理
│   ├── get         # 获取配置值
│   ├── set         # 设置配置值
│   ├── list        # 列出配置
│   └── reload      # 重新加载配置
├── agents          # 智能体配置管理
│   ├── list        # 列出智能体
│   ├── info        # 查看详情
│   ├── add         # 添加智能体
│   ├── delete      # 删除智能体
│   └── reload      # 重载智能体
├── agent           # 与智能体交互
│   ├── run         # 派发任务
│   └── chat        # 交互对话
├── rules           # 规则链管理
│   ├── list        # 列出规则链
│   └── reload      # 重载规则链
├── cron            # 定时任务管理
│   ├── list        # 列出任务
│   ├── create      # 创建任务
│   ├── delete      # 删除任务
│   ├── get         # 获取详情
│   ├── enable      # 启用任务
│   └── disable     # 禁用任务
├── message         # 消息发送
│   ├── send        # 发送消息
│   └── channels    # 列出通道
└── service         # 服务管理
    ├── install     # 安装服务
    ├── uninstall   # 卸载服务
    ├── start       # 启动服务
    ├── stop        # 停止服务
    ├── restart     # 重启服务
    └── status      # 查看状态
```

---

## 服务管理

### start - 启动服务

启动 TPCLAW 智能体服务。

```bash
# 前台启动
tpclaw start

# 指定端口
tpclaw start -p 8080

# 使用配置文件
tpclaw start -c /path/to/config.yaml

# 后台守护进程模式
tpclaw start -d
```

**选项：**

| 选项 | 默认值 | 说明 |
|------|--------|------|
| `--port` / `-p` | `9527` | 服务端口 |
| `--config` / `-c` | - | 配置文件路径 |
| `--daemon` / `-d` | `false` | 后台运行 |

### version - 版本信息

```bash
tpclaw version
```

输出示例：
```
tpclaw v1.0.0
  Git commit: abc123
  Build time: 2024-01-01
  Go version: go1.21.0
  OS/Arch:    linux/amd64
```

---

## 配置管理

### config get - 获取配置值

```bash
tpclaw config get <key> [--json]

# 示例
tpclaw config get llm.model
tpclaw config get server.port
tpclaw config get data.root_dir --json
```

### config set - 设置配置值

```bash
tpclaw config set <key> <value>

# 示例
tpclaw config set llm.model gpt-4o
tpclaw config set server.port 9091
tpclaw config set data.root_dir ./data
```

### config list - 列出配置

```bash
tpclaw config list [section] [--json]

# 示例
tpclaw config list
tpclaw config list llm
tpclaw config list server --json
```

### config reload - 重新加载配置

```bash
tpclaw config reload
```

**默认配置项：**

| 配置项 | 默认值 |
|--------|--------|
| `server.host` | `0.0.0.0` |
| `server.port` | `9527` |
| `data.root_dir` | `./data` |
| `global.llm_url` | `https://open.bigmodel.cn/api/paas/v4` |
| `global.llm_model` | `GLM-5` |
| `security.requireAuth` | `false` |

---

## 智能体管理

### agents list - 列出智能体

```bash
tpclaw agents list [--json]
```

### agents info - 查看智能体详情

```bash
tpclaw agents info <agent-id> [--json]

# 示例
tpclaw agents info main
tpclaw agents info my-agent --json
```

### agents add - 添加智能体

```bash
tpclaw agents add <agent-id> [options]

# 选项
-n, --name string          智能体名称
-m, --model string         使用的模型
-d, --description string   智能体描述

# 示例
tpclaw agents add my-agent -n "我的助手" -m "GLM-4" -d "辅助开发的智能体"
```

### agents delete - 删除智能体

```bash
tpclaw agents delete <agent-id> [--force]

# 示例
tpclaw agents delete my-agent
tpclaw agents delete my-agent -f  # 强制删除，不确认
```

### agents reload - 重新加载智能体

```bash
tpclaw agents reload [agent-id]

# 示例
tpclaw agents reload         # 重载 main 智能体
tpclaw agents reload my-agent
```

---

## 与智能体交互

### agent run - 派发任务

向智能体发送任务并获取响应。

```bash
# 直接派发任务
tpclaw agent -m "帮我分析这段代码"

# 指定智能体
tpclaw agent -a my-agent -m "帮我分析这段代码"

# 从文件读取任务
tpclaw agent -f task.txt

# 非流式输出
tpclaw agent run -m "任务内容" --no-stream

# JSON 格式输出
tpclaw agent run -m "任务内容" --json
```

**全局选项：**

| 选项 | 默认值 | 说明 |
|------|--------|------|
| `--message` / `-m` | - | 任务内容 |
| `--agent` / `-a` | `main` | 智能体 ID |
| `--file` / `-f` | - | 从文件读取任务内容 |
| `--no-stream` | `false` | 非流式输出 |
| `--json` | `false` | JSON 格式输出 |

### agent chat - 交互式对话

进入交互式对话模式，持续与智能体交流。

```bash
tpclaw agent chat [-a <agent-id>]

# 示例
tpclaw agent chat
tpclaw agent chat -a my-agent
```

---

## 规则链管理

### rules list - 列出规则链

```bash
tpclaw rules list [options]

# 选项
-a, --agent-id string   按智能体 ID 过滤
-c, --category string   按分类过滤
--json                  JSON 格式输出

# 示例
tpclaw rules list
tpclaw rules list -c agents --json
tpclaw rules list -a my-agent
```

### rules reload - 重新加载规则链

```bash
tpclaw rules reload [rule-id] [-a <agent-id>]

# 示例
tpclaw rules reload           # 重载 main 规则链
tpclaw rules reload my-rule   # 重载指定规则链
tpclaw rules reload my-rule -a my-agent
```

---

## 定时任务管理

### cron list - 列出定时任务

```bash
tpclaw cron list [options]

# 选项
-a, --agent-id string   按智能体 ID 过滤
--json                  JSON 格式输出

# 示例
tpclaw cron list
tpclaw cron list -a my-agent --json
```

### cron create - 创建定时任务

```bash
tpclaw cron create <name> [options]

# 选项
-s, --schedule string   Cron 表达式（必填）
-m, --message string    任务消息内容
-t, --target string     目标规则链 ID（默认 main）
-a, --agent-id string   智能体 ID

# 示例
# 每天早上 8 点执行
tpclaw cron create "每日提醒" -s "0 0 8 * * *" -m "早上好！新的一天开始了"

# 每 5 分钟执行一次
tpclaw cron create "定时检查" -s "0 */5 * * * *" -m "检查状态"

# 工作日早上 9 点执行
tpclaw cron create "工作日提醒" -s "0 0 9 * * 1-5" -m "开始工作" -t "main"
```

**Cron 表达式格式：** `秒 分 时 日 月 周`

```
┌───────────── 秒 (0-59)
│ ┌───────────── 分 (0-59)
│ │ ┌───────────── 时 (0-23)
│ │ │ ┌───────────── 日 (1-31)
│ │ │ │ ┌───────────── 月 (1-12)
│ │ │ │ │ ┌───────────── 周 (0-6, 0=周日)
│ │ │ │ │ │
* * * * * *
```

**常用表达式：**

| 表达式 | 描述 |
|--------|------|
| `0 0 8 * * *` | 每天早上 8 点 |
| `0 0 9 * * 1-5` | 工作日早上 9 点 |
| `0 */5 * * * *` | 每 5 分钟 |
| `0 0 */2 * * *` | 每 2 小时 |
| `0 30 12 * * *` | 每天中午 12:30 |
| `0 0 18 * * 1,3,5` | 周一、三、五下午 6 点 |

### cron get - 获取任务详情

```bash
tpclaw cron get <task-id> [-a <agent-id>] [--json]

# 示例
tpclaw cron get task-123
tpclaw cron get task-123 --json
```

### cron delete - 删除任务

```bash
tpclaw cron delete <task-id> [-a <agent-id>]

# 示例
tpclaw cron delete task-123
```

### cron enable/disable - 启用/禁用任务

```bash
tpclaw cron enable <task-id> [-a <agent-id>]
tpclaw cron disable <task-id> [-a <agent-id>]
```

---

## 消息发送

### message send - 发送消息

```bash
tpclaw message send <chat_id> [options]

# 选项
-p, --platform string   平台 (feishu/dingtalk/wecom)
-m, --message string    消息内容
-a, --account string    账号 ID（默认 default）

# 示例
# 发送消息到飞书
tpclaw message send oc_xxx -p feishu -m "Hello World"

# 发送消息到钉钉
tpclaw message send chat-xxx -p dingtalk -m "通知消息"

# 使用指定账号
tpclaw message send oc_xxx -p feishu -m "消息" -a my-account
```

**支持的平台：**

| 平台 | `--platform` 值 | 目标格式 |
|------|-----------------|---------|
| 飞书 | `feishu` | 群聊: `oc_xxx`, 私聊: `ou_xxx` |
| 钉钉 | `dingtalk` | 群聊: `cid_xxx`, 私聊: `uid_xxx` |
| 企业微信 | `wecom` | 群聊/私聊 ID |

### message channels - 列出可用通道

```bash
tpclaw message channels
```

---

## 系统服务管理

### service install - 安装服务

```bash
tpclaw service install [options]

# 选项
--system              安装为系统级服务（需要 root 权限）
--name string         服务名称（默认 tpclaw）
-c, --config string   配置文件路径
--user string         服务运行用户（仅系统级服务）
-w, --workdir string  工作目录
-e, --exec string     可执行文件安装路径

# 示例
# 安装为用户级服务
tpclaw service install

# 安装为系统级服务
sudo tpclaw service install --system

# 指定配置文件和工作目录
tpclaw service install -c /etc/tpclaw/config.yaml -w /var/tpclaw

# 安装自定义名称的服务
tpclaw service install --name my-tpclaw
```

### service uninstall - 卸载服务

```bash
tpclaw service uninstall [--system] [--name <name>]

# 示例
tpclaw service uninstall
sudo tpclaw service uninstall --system
```

### service start/stop/restart - 控制服务

```bash
tpclaw service start
tpclaw service stop
tpclaw service restart
```

### service status - 查看服务状态

```bash
tpclaw service status
```

---

## 环境变量

| 变量 | 说明 |
|------|------|
| `TPCLAW_APP_NAME` | 应用名称（默认从可执行文件名获取） |
| `TPCLAW_API_KEY` | API 认证密钥 |

---

## 使用技巧

### 1. 快速启动

```bash
# 无子命令直接启动服务
tpclaw

# 或使用 start 命令
tpclaw start -p 8080
```

### 2. 配置管理

```bash
# 查看所有配置
tpclaw config list

# 修改模型配置
tpclaw config set global.llm_model gpt-4o

# 重新加载配置
tpclaw config reload
```

### 3. 智能体交互

```bash
# 快速提问
tpclaw agent -m "今天天气怎么样？"

# 复杂任务（从文件读取）
tpclaw agent -f task.txt

# 交互式对话
tpclaw agent chat
```

### 4. 定时任务

```bash
# 创建每日提醒
tpclaw cron create "每日早报" -s "0 0 8 * * *" -m "生成今日早报"

# 查看任务列表
tpclaw cron list

# 禁用任务（不删除）
tpclaw cron disable task-123
```

---

## 相关文档

- [REST API](/guide/api/rest-api) - HTTP API 参考
- [配置文件](/guide/configuration/config-file) - 配置说明
- [定时任务技能](/guide/tools/cron-task) - 定时任务详细说明
