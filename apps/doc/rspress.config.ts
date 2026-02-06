import { defineConfig } from 'rspress/config';

export default defineConfig({
  title: 'AI 前端监控平台',
  description: '前端监控与智能分析平台使用文档',
  base: '/',
  markdown: {
    showLineNumbers: true,
  },
  themeConfig: {
    footer: {
      message: 'Released under the MIT License.',
    },
    nav: [
      {
        text: '首页',
        link: '/',
      },
      {
        text: '指南',
        link: '/guide/getting-started',
      },
      {
        text: 'SDK',
        link: '/sdk/overview',
      },
      {
        text: 'API',
        link: '/api/overview',
      },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '开始使用',
          items: ['/guide/introduction', '/guide/getting-started'],
        },
      ],
      '/sdk/': [
        {
          text: 'SDK 使用指南',
          items: ['/sdk/overview'],
        },
      ],
      '/api/': [
        {
          text: 'API 文档',
          items: ['/api/overview'],
        },
      ],
      '/configuration/': [
        {
          text: '配置说明',
          items: ['/configuration/overview'],
        },
      ],
    },
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/lotosv2010/g-ai-metrics',
      },
    ],
  },
  root: 'docs',
});
