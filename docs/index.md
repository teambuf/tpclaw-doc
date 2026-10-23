---
layout: home

hero:
  name: "TPCLAW"
  text: "AI Agent Platform"
  tagline: 自托管 AI 智能体平台 — 自主干活，自主进化，技能无限扩展
  image:
    src: /logo.png
    alt: TPCLAW
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started/quickstart
    - theme: alt
      text: 了解更多
      link: /guide/introduction/what-is-tpclaw
    - theme: alt
      text: Gitee
      link: https://gitee.com/rulego/tpclaw

features:
  - icon: 🤖
    title: 自主干活
    details: 给一个目标，智能体自主拆解任务、规划步骤、调用工具链完成执行。支持文件读写、Shell 命令、浏览器自动化等
  - icon: 🧠
    title: 自主进化
    details: 记忆系统让智能体从每次交互中积累经验和知识，越用越聪明，越用越懂你
  - icon: ⚡
    title: 可视化编排智能体
    details: 基于 RuleGo 规则引擎，通过可视化拖拽编辑器编排智能体和工作流，可直接使用 RuleGo 生态的丰富组件，修改即时生效
  - icon: 🔌
    title: 智能体即服务
    details: 每个智能体对外暴露标准 OpenAI API，已有应用只需改一行配置即可接入，零改造成本
  - icon: 💬
    title: IM 多通道
    details: 原生支持飞书、企业微信长连接接入，扫码即用，无需公网 IP
  - icon: 🧩
    title: 技能无限扩展
    details: 兼容 OpenClaw、Claude Code 等市面上所有 Markdown 格式技能，直接导入即可使用

  # 首页公告（置空 notice 或删除该字段则不显示公告）
notice:
  version: v1.2.1
  date: 2026-10-23
  title: 📢 TPCLAW v1.2.1 发布！
  items:
    - 'feat: 智能体工具面板支持配置 MCP 工具'
    - 'feat: MCP 图片识别钩子——智能体可识读工具返回的图片'
    - 'feat: 智能体消息支持 ext 透传参数，直达下游接口并原样回显'
    - 'fix: 聊天消息内图片限宽，支持点击查看原图'
    - 'fix: 视觉模型文件截断与模型选择打分修复'
    - 'fix: 智能体工作空间宽度自适应与全屏滚动条修复'
    - 'chore: 依赖对齐 RuleGo v1.0.0'
  link: /guide/getting-started/installation
  linkText: 立即下载
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe 30%, #41d1ff);
  --vp-home-hero-image-background-image: linear-gradient(-45deg, #bd34fe 50%, #47caff 50%);
  --vp-home-hero-image-filter: blur(44px);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px);
  }
}
</style>
