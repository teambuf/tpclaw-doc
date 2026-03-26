# message-send 技能

消息发送技能，用于发送消息到指定通道。当定时任务触发、用户长时间未回复、或需要主动联系用户时使用此技能。

## 命令格式

```bash
tpclaw message send <chat_id> --platform <platform> --message "消息内容"
```

**参数说明：**

| 参数 | 必须 | 说明 |
|------|------|------|
| `<chat_id>` | 是 | 目标聊天 ID（位置参数） |
| `--platform` / `-p` | 是 | 通道平台（feishu/dingtalk/wecom） |
| `--message` / `-m` | 是 | 消息内容 |
| `--account` / `-a` | 否 | 账号 ID（默认：default） |

## 上下文通道信息

定时任务触发时，上下文会包含最近活跃的通道信息：

| 字段 | 说明 |
|------|------|
| `lastPlatform` | 最新通道平台 |
| `lastChatId` | 最新通道的聊天 ID |
| `lastChannels` | 最近通道列表 |

**使用上下文通道：**

```bash
# 使用最新活跃通道
tpclaw message send ${lastChatId} --platform ${lastPlatform} --message "你的消息"
```

## 支持的平台

| 平台 | `--platform` 值 | 目标格式 |
|------|-----------------|---------|
| 飞书 | `feishu` | 群聊: `oc_xxx`, 私聊: `ou_xxx` |
| 钉钉 | `dingtalk` | 群聊: `cid_xxx`, 私聊: `uid_xxx` |
| 企业微信 | `wecom` | 群聊/私聊 ID |

## 使用示例

### 发送到飞书群

```bash
tpclaw message send oc_xxx --platform feishu --message "任务已完成"
```

### 指定账号发送

```bash
tpclaw message send oc_xxx --platform feishu --account work --message "工作通知"
```

### 定时任务发送通知

```bash
# 创建定时任务
tpclaw cron create "早报" -s "0 0 8 * * *" -m "生成早报并发送到飞书群 oc_xxx"

# 触发后执行
tpclaw message send oc_xxx --platform feishu --message "早安！这是你的今日早报"
```

### 工作日下班提醒

```bash
tpclaw cron create "下班提醒" -s "0 0 18 * * 1-5" -m "发送下班提醒到飞书群 oc_xxx"

# 触发后执行
tpclaw message send oc_xxx --platform feishu --message "下班时间到了"
```

### 列出可用通道

```bash
tpclaw message channels
```

## 与定时任务配合

定时任务可以与消息发送技能配合使用：

```bash
# 创建定时任务，触发后发送消息
tpclaw cron create "每日报告" -s "0 0 18 * * *" -m "发送今日工作总结到飞书群 oc_xxx"
```

定时任务触发后，智能体会调用消息发送技能：

```bash
tpclaw message send oc_xxx --platform feishu --message "今日工作总结：..."
```

## 相关文档

- [cron-task 技能](/guide/tools/cron-task) - 定时任务
- [feishu-api 技能](/guide/tools/feishu-api) - 飞书 API 调用
- [CLI 命令参考](/guide/api/cli) - 完整 CLI 命令
