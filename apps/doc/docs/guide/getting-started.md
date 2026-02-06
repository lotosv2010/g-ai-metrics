# 快速开始

本指南将帮助你快速搭建 AI 前端监控平台。

## 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0

## 安装

### 1. 克隆项目

```bash
git clone <repository-url>
cd g-ai-metrics
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 配置环境变量

AI 服务需要配置 Ollama 相关环境变量：

```bash
cd packages/ai
cp .env.example .env
# 根据实际情况修改 .env 中的配置
```

`.env` 文件内容：

```env
PORT=3010
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2
```

## 开发

### 启动所有服务

```bash
pnpm dev
```

这将启动以下服务：

- `example`: http://localhost:3030
- `ai`: http://localhost:3010
- `doc`: http://localhost:3020

### 启动单个服务

```bash
# 启动示例应用
pnpm --filter example dev

# 启动 AI 分析引擎
pnpm --filter ai dev

# 启动文档
pnpm --filter doc dev
```

## 集成到现有项目

### 1. 安装 SDK

```bash
pnpm add @g-ai-metrics/metrics
```

### 2. 初始化 SDK

```typescript
import MetricsSDK from '@g-ai-metrics/metrics';

const metrics = new MetricsSDK({
  apiEndpoint: 'http://localhost:3010',
  appId: 'your-app-id',
  debug: true,
});

// 开始监控
metrics.startSession();
```

### 3. 使用 API

```typescript
// 追踪事件
metrics.trackEvent('user_click', { button: 'submit' });

// 捕获错误
try {
  // 你的代码
} catch (error) {
  metrics.captureError(error);
}
```

## 下一步

- 阅读 [SDK 使用指南](/sdk/overview) 了解更多 API
- 查看 [配置选项](/configuration/overview) 自定义监控行为
