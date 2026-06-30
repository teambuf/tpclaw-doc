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
  version: v1.1.0
  date: 2026-06-30
  title: 📢 TPCLAW v1.1.0 发布！
  items:
    - 会话级模型切换：聊天中临时切换模型，不影响全局智能体配置
    - 思考强度设置：统一选择器支持 GLM/GPT/o 系列等模型的思考模式与深度调节
    - 模型扩展字段可视化：按模型自动展示思考、推理等参数，无需手填 key
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
