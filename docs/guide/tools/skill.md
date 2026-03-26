# skill - 技能调用工具

调用预定义的技能文件，让智能体执行特定任务。

## 概述

`skill` 工具让智能体能够：
- 调用预定义的技能
- 执行复杂的任务流程
- 复用知识和能力

## 配置

```json
{
  "type": "builtin",
  "name": "skill",
  "description": "调用预定义的技能文件",
  "config": {
    "userDirs": [
      "${global.root_dir}/workspace/skills"
    ]
  }
}
```

### 配置参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `userDirs` | []string | - | 技能文件目录列表 |
| `autoReload` | bool | true | 自动重新加载修改的技能 |

## 调用技能

### 基本调用

```json
{
  "name": "weather",
  "params": {
    "city": "北京"
  }
}
```

### 带参数调用

```json
{
  "name": "translation",
  "params": {
    "text": "Hello, World!",
    "from": "en",
    "to": "zh"
  }
}
```

## 技能文件格式

技能文件使用 Markdown 格式，包含 YAML frontmatter：

```markdown
---
name: weather
description: 查询天气信息
parameters:
  city:
    type: string
    required: true
    description: 城市名称
  date:
    type: string
    required: false
    description: 日期（可选）
---

# 天气查询技能

## 使用场景
- 用户询问天气
- 需要了解天气状况

## 执行步骤
1. 确认城市名称
2. 调用天气 API
3. 返回格式化结果

## 输出格式
**{city} 天气预报**
🌡️ 温度: {temp}°C
...
```

## 技能目录结构

```
workspace/skills/
├── weather.md           # 天气查询
├── translation.md       # 翻译
├── code_review.md       # 代码审查
├── data_analysis.md     # 数据分析
└── custom/              # 自定义技能目录
    └── my_skill.md
```

## 内置技能

| 技能 | 说明 |
|------|------|
| `summary` | 文本摘要 |
| `translation` | 多语言翻译 |
| `code_explain` | 代码解释 |

## 最佳实践

### 1. 技能命名规范

使用清晰、描述性的名称：

```
# 推荐
weather_query.md
code_review.md
document_summary.md

# 不推荐
skill1.md
temp.md
```

### 2. 完善的参数说明

```yaml
parameters:
  code:
    type: string
    required: true
    description: 要审查的代码内容
  language:
    type: string
    required: false
    description: 编程语言（go, python, javascript 等）
    default: auto
```

### 3. 明确的输出格式

在技能文件中定义输出格式：

```markdown
## 输出格式

### 代码审查报告

| 级别 | 位置 | 问题描述 | 建议 |
|------|------|----------|------|
| 严重 | Line 42 | SQL 注入风险 | 使用参数化查询 |
```

## 相关文档

- [工具概述](/guide/tools/) - 工具概述
- [工作空间](/guide/workspace/structure) - 工作空间结构
