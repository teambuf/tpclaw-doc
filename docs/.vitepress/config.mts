import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(defineConfig({
  title: "TPCLAW",
  description: "AI 智能体平台",
  lang: 'zh-CN',

  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:title', content: 'TPCLAW | AI Agent Platform' }],
    ['meta', { name: 'og:description', content: '基于 RuleGo 规则引擎的 AI 智能体平台，支持多智能体协作、工具调用、IM 通道集成' }],
  ],

  themeConfig: {
    logo: '/logo.png',

    nav: [
      { text: '首页', link: '/' },
      { text: '介绍', link: '/guide/introduction/what-is-tpclaw' },
      { text: '快速开始', link: '/guide/getting-started/installation' },
      {
        text: '核心功能',
        items: [
          { text: '智能体', link: '/guide/core-features/agents' },
          { text: '工具/技能', link: '/guide/tools/' },
          { text: '通道', link: '/guide/channels/api' },
          { text: '会话', link: '/guide/core-features/sessions' },
          { text: '记忆', link: '/guide/core-features/memory' },
          { text: '工作空间', link: '/guide/workspace/structure' },
          { text: '配置', link: '/guide/configuration/config-file' },
          { text: 'CLI 命令', link: '/guide/api/cli' },
          { text: 'REST API', link: '/guide/api/rest-api' },
          { text: '应用案例', link: '/guide/use-cases/' },
        ]
      },
      { text: 'GitHub', link: 'https://github.com/rulego/tpclaw' }
    ],

    sidebar: {
      // 介绍
      '/guide/introduction/': [
        {
          text: '介绍',
          items: [
            { text: '什么是 TPCLAW', link: '/guide/introduction/what-is-tpclaw' },
            { text: '核心概念', link: '/guide/introduction/core-concepts' },
            { text: '架构概览', link: '/guide/introduction/architecture' },
            { text: '与其他方案对比', link: '/guide/introduction/comparison' },
          ]
        }
      ],

      // 快速开始
      '/guide/getting-started/': [
        {
          text: '快速开始',
          items: [
            { text: '环境要求', link: '/guide/getting-started/requirements' },
            { text: '安装', link: '/guide/getting-started/installation' },
            { text: '5分钟入门', link: '/guide/getting-started/quickstart' },
            { text: '配置 API Key', link: '/guide/getting-started/api-key' },
          ]
        }
      ],

      // 核心功能
      '/guide/core-features/': [
        {
          text: '核心功能',
          items: [
            { text: '智能体', link: '/guide/core-features/agents' },
            { text: '会话管理', link: '/guide/core-features/sessions' },
            { text: '记忆系统', link: '/guide/core-features/memory' },
          ]
        }
      ],

      // 工具/技能
      '/guide/tools/': [
        {
          text: '概述',
          items: [
            { text: '工具概述', link: '/guide/tools/' },
          ]
        },
        {
          text: '内置工具',
          items: [
            { text: 'read - 文件读取', link: '/guide/tools/read' },
            { text: 'write - 文件写入', link: '/guide/tools/write' },
            { text: 'edit - 文件编辑', link: '/guide/tools/edit' },
            { text: 'bash - Shell 执行', link: '/guide/tools/bash' },
            { text: 'skill - 技能调用', link: '/guide/tools/skill' },
            { text: 'browser_use - 浏览器自动化', link: '/guide/tools/browser-use' },
          ]
        },
        {
          text: '内置技能',
          items: [
            { text: 'agent-message - 智能体消息', link: '/guide/tools/agent-message' },
            { text: 'message-send - 消息发送', link: '/guide/tools/message-send' },
            { text: 'cron-task - 定时任务', link: '/guide/tools/cron-task' },
            { text: 'feishu-api - 飞书API', link: '/guide/tools/feishu-api' },
          ]
        }
      ],

      // IM 通道
      '/guide/channels/': [
        {
          text: 'IM 通道',
          items: [
            { text: 'API 通道', link: '/guide/channels/api' },
            { text: '飞书', link: '/guide/channels/feishu' },
            { text: '钉钉', link: '/guide/channels/dingtalk' },
            { text: '企业微信', link: '/guide/channels/wecom' },
            { text: 'Telegram', link: '/guide/channels/telegram' },
            { text: 'WebSocket', link: '/guide/channels/websocket' },
          ]
        }
      ],

      // 配置参考
      '/guide/configuration/': [
        {
          text: '配置参考',
          items: [
            { text: '配置文件', link: '/guide/configuration/config-file' },
            { text: '模型配置', link: '/guide/configuration/models' },
            { text: '智能体配置', link: '/guide/configuration/agents' },
            { text: '通道配置', link: '/guide/configuration/channels' },
            { text: '安全配置', link: '/guide/configuration/security' },
          ]
        }
      ],

      // 工作空间
      '/guide/workspace/': [
        {
          text: '工作空间',
          items: [
            { text: '结构说明', link: '/guide/workspace/structure' },
            { text: 'BOOTSTRAP.md', link: '/guide/workspace/bootstrap' },
            { text: 'IDENTITY.md', link: '/guide/workspace/identity' },
            { text: 'AGENTS.md', link: '/guide/workspace/agents-workspace' },
            { text: 'SOUL.md', link: '/guide/workspace/soul' },
            { text: 'TOOLS.md', link: '/guide/workspace/tools-md' },
            { text: 'USER.md', link: '/guide/workspace/user' },
            { text: 'MEMORY.md', link: '/guide/workspace/memory-md' },
          ]
        }
      ],

      // API 参考
      '/guide/api/': [
        {
          text: 'API 参考',
          items: [
            { text: 'REST API', link: '/guide/api/rest-api' },
            { text: 'WebSocket API', link: '/guide/api/websocket' },
            { text: 'CLI 命令', link: '/guide/api/cli' },
          ]
        }
      ],

      // 高级主题
      '/guide/advanced/': [
        {
          text: '高级主题',
          items: [
            { text: '多智能体协作', link: '/guide/advanced/multi-agent' },
            { text: '子智能体', link: '/guide/advanced/sub-agent' },
            { text: '统一智能体设计', link: '/guide/advanced/unified-agent' },
            { text: '向量检索 RAG', link: '/guide/advanced/rag' },
            { text: 'MCP 协议', link: '/guide/advanced/mcp-protocol' },
            { text: '切面编程', link: '/guide/advanced/aspect' },
            { text: '自定义组件', link: '/guide/advanced/custom-components' },
          ]
        }
      ],

      // 示例与教程
      '/guide/examples/': [
        {
          text: '示例与教程',
          items: [
            { text: '客服智能体', link: '/guide/examples/customer-service' },
            { text: '图片识别智能体', link: '/guide/examples/image-recognition' },
            { text: '自动化任务', link: '/guide/examples/automation' },
            { text: '浏览器自动化', link: '/guide/examples/browser-automation' },
          ]
        }
      ],

      // 应用案例
      '/guide/use-cases/': [
        {
          text: '应用案例',
          items: [
            { text: '概述', link: '/guide/use-cases/' },
          ]
        }
      ],

      // 部署
      '/guide/deployment/': [
        {
          text: '部署',
          items: [
            { text: '本地开发', link: '/guide/deployment/local' },
            { text: '生产部署', link: '/guide/deployment/production' },
            { text: '监控告警', link: '/guide/deployment/monitoring' },
          ]
        }
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/teambuf/tpclaw' }
    ],

    footer: {
      message: '基于 Apache-2.0 许可发布',
      copyright: 'Copyright © 2026-present TPCLAW Team'
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换'
            }
          }
        }
      }
    },

    outline: {
      label: '页面导航',
      level: [2, 3]
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short'
      }
    }
  }
}))