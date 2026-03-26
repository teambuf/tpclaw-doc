---
layout: home

hero:
  name: "TPCLAW"
  text: "AI Agent Platform"
  tagline: 自托管 AI 智能体平台，支持多智能体协作、工具调用、多通道接入
  image:
    src: /logo.png
    alt: TPCLAW
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started/installation
    - theme: alt
      text: 了解更多
      link: /guide/introduction/what-is-tpclaw
    - theme: alt
      text: GitHub
      link: https://github.com/teambuf/tpclaw

features:
  - icon: 🏠
    title: 自托管
    details: 完全控制您的数据和基础设施，在您自己的硬件上运行，无需依赖第三方服务
  - icon: 🤖
    title: 多智能体协作
    details: 支持主智能体调用子智能体，实现复杂任务的分解和协作处理
  - icon: ⚡
    title: 灵活编排
    details: 可视化工作流设计，轻松编排智能体任务流程，支持复杂任务自动化
  - icon: 🔧
    title: 丰富工具集
    details: 内置文件操作、浏览器自动化、网络搜索、代码执行等多种工具
  - icon: 💬
    title: IM 多通道
    details: 支持飞书、钉钉、企业微信、Telegram 等多平台消息接入
  - icon: 🧠
    title: 记忆与进化
    details: 长期记忆存储、每日日志、心跳任务，支持智能体自我学习和改进
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

## 什么是 TPCLAW？

TPCLAW（TeamClaw）是一个**自托管**的 AI 智能体平台，让您可以轻松构建、部署和管理 AI 智能体系统，完全掌控您的数据和基础设施。

### 谁在使用？

- **开发者**: 构建个人 AI 助手，无需依赖托管服务
- **企业团队**: 部署内部 AI 服务，保护数据隐私
- **AI 研究者**: 快速原型开发和实验

### 核心特性

- **灵活编排**: 可视化工作流设计，轻松编排任务流程
- **多模型支持**: OpenAI、智谱、阿里云百炼、Ollama 等
- **工具扩展**: 支持自定义工具和技能
- **会话管理**: 上下文压缩、历史记录、多会话支持
- **可观测性**: 完善的日志、事件和监控

## 快速开始

```bash
# 克隆仓库
git clone https://github.com/teambuf/tpclaw.git
cd tpclaw

# 安装依赖
go mod download

# 配置 API Key
cp configs/config.yaml.example configs/config.yaml
# 编辑 config.yaml，填入您的 API Key

# 启动服务
go run cmd/server/main.go
```

打开浏览器访问 http://127.0.0.1:9527 开始使用！

## 资源

- [GitHub 仓库](https://github.com/teambuf/tpclaw)
- [问题反馈](https://github.com/teambuf/tpclaw/issues)
