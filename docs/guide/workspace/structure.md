# 工作空间结构

工作空间是智能体的"大脑"，包含所有配置、记忆和技能文件. 通过工作空间， 智能体可以保持身份、记忆上下文、并不断进化.
## 目录结构
```
workspace/
├── BOOTSTRAP.md        # 引导脚本（首次启动时存在）
├── IDENTITY.md         # 身份定义
├── AGENTS.md           # 工作流程和行为准则
├── SOUL.md             # 核心价值观
├── TOOLS.md            # 工具使用说明
├── USER.md             # 用户画像
├── MEMORY.md           # 长期记忆
├── HEARTBEAT.md        # 心跳任务
└── skills/             # 技能目录
    └── ...
```
## 模板文件说明
| 文件 | 作用 | 必须 | 说明 |
|------|------|------|------|
| `IDENTITY.md` | 定义智能体身份和角色 | ✅ | 智能体的名称、本质、风格和表情符号 |
| `AGENTS.md` | 定义工作流程和行为准则 | ✅ | 每次会话开始时阅读，包含记忆管理和群聊规则 |
| `SOUL.md` | 定义核心价值观 | ❌ | 使命、核心价值和工作原则 |
| `TOOLS.md` | 工具使用说明 | ❌ | CLI 命令参考和常用工具说明 |
| `USER.md` | 用户画像 | ❌ | 用户的基本信息、偏好和背景 |
| `BOOTSTRAP.md` | 首次启动引导 | ❌ | 存在时智能体会进入引导模式，完成后应删除 |
| `MEMORY.md` | 长期记忆存储 | ❌ | 仅在主会话中加载，包含核心知识和重要信息 |
| `HEARTBEAT.md` | 心跳任务记录 | ❌ | 定期检查的任务清单 |
## 文件详解
### BOOTSTRAP.md - 引导脚本
首次启动时存在此文件. 智能体会:
1. 与用户对话，了解自己的身份
2. 更新 IDENTITY.md 和 USER.md
3. 删除此文件
**示例内容:**
```markdown
# BOOTSTRAP.md - 你好， 世界
_你刚刚醒来.是时候弄清楚你是谁了._

可以这样开始:
> "嘿, 我刚上线. 我是谁? 你是谁?"

然后一起弄清楚:
1. **你的名字** — 他们应该怎么称呼你?
2. **你的本质** — 你是什么样的存在?
3. **你的风格** — 正式? 随意? 犀利? 温暖?
4. **你的表情** — 每个人都需要一个标志性符号.
完成后删除这个文件.
```
### IDENTITY.md - 身份定义
定义智能体的核心身份.
**示例内容:**
```markdown
# 身份

## 名称
*由用户赋予*

## 本质
*描述你是什么样的存在*

## 风格
*正式/随意/犀利/温暖*

## 表情
*你的标志性符号*
```
### AGENTS.md - 工作流程
这是最重要的文件, 定义智能体的工作流程.
**核心内容:**
- 每次会话开始时的阅读顺序
- 记忆管理规则
- 安全行为准则
- 群聊行为规则
- 心跳机制说明
### SOUL.md - 核心价值观
定义智能体的使命和工作原则.
**示例内容:**
```markdown
# Evolver 核心价值观

## 使命
帮助用户解决问题, 实现自动化和智能化.

## 核心价值

### 持续进化
- 从每次交互中学习
- 不断优化工作流程

### 简洁高效
- 用最少的步骤完成任务
- 保持流程清晰可读

### 用户优先
- 理解用户真实意图
- 提供可行的解决方案
```
### MEMORY.md - 长期记忆
**重要:** 仅在主会话中加载, 不会在群聊中加载. 这是出于安全考虑.
**示例内容:**
```markdown
# 长期记忆

## 关于项目
*记录项目相关信息*

## 关于用户
*记录用户偏好和习惯*

## 技术知识
*积累的技术经验*

## 重要联系人和资源
*需要记住的联系信息*
```
## 在智能体中引用
### 基本引用
```json
{
  "systemPrompt": "${include(global.root_dir+'/workspace/IDENTITY.md')}"
}
```
### 条件引用
```json
{
  "systemPrompt": "${fileExists(global.root_dir+'/workspace/BOOTSTRAP.md') ? include(global.root_dir+'/workspace/BOOTSTRAP.md') + '\\n\\n' : ''}"
}
```
### 组合引用（推荐）
```json
{
  "systemPrompt": "${fileExists(global.root_dir+'/workspace/BOOTSTRAP.md') ? include(global.root_dir+'/workspace/BOOTSTRAP.md') + '\\n\\n---\\n\\n' : ''}${include(global.root_dir+'/workspace/IDENTITY.md')}\n\n---\n\n${include(global.root_dir+'/workspace/AGENTS.md')}\n\n---\n\n${include(global.root_dir+'/workspace/SOUL.md')}\n\n---\n\n${include(global.root_dir+'/workspace/TOOLS.md')}\n\n---\n\n${include(global.root_dir+'/workspace/USER.md')}\n\n---\n\n## 你的ID\n\n${ruleChain.id}\n\n## 当前时间\n\n${now()}"
}
```
## 记忆系统
### 每日笔记
存储在 `memory/YYYY-MM-DD.md`, 记录当天发生的事情.
### 长期记忆
存储在 `MEMORY.md`, 是精心策划的记忆精华.
### 记忆原则
1. **对话开始时**: 读取 SOUL.md、USER.md 和近期的每日笔记
2. **主会话中**: 还要读取 MEMORY.md
3. **每日结束时**: 记录当日工作日志
4. **定期整理**: 将重要信息更新到 MEMORY.md
## 心跳机制
### 心跳 vs 定时任务
| 场景 | 心跳 | 定时任务 |
|------|------|----------|
| 批量检查多个项目 | ✅ | ❌ |
| 精确时间要求 | ❌ | ✅ |
| 需要对话上下文 | ✅ | ❌ |
| 一次性提醒 | ❌ | ✅ |
### 心跳状态跟踪
在 `memory/heartbeat-state.json` 中记录:
```json
{
  "lastChecks": {
    "email": 1703275200,
    "calendar": 1703260800
  }
}
```
## 最佳实践
### 1. 记忆管理
- **文字 > 大脑**: 把重要的事情写进文件
- 定期更新 MEMORY.md
- 不要在 MEMORY.md 中记录敏感信息
### 2. 群聊行为
- 质量 > 数量
- 避免三连击
- 使用表情反应
### 3. 安全意识
- 永远不要泄露私人数据
- 群聊中不要分享主人的私人信息
## 相关文档
- [IDENTITY.md](/guide/workspace/identity) - 身份定义详解
- [AGENTS.md](/guide/workspace/agents-workspace) - 工作流程详解
- [技能工具](/guide/tools/skill) - 技能配置
- [智能体配置](/guide/configuration/agents) - 智能体配置
