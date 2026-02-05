# AI 前端监控 Monorepo 项目

基于 pnpm + turborepo 的 Monorepo 项目，用于前端监控与智能分析。

## 项目结构

```
g-ai-metrics/
├── apps/
│   └── example/          # Vite + React 示例项目
│       ├── src/
│       ├── package.json
│       ├── tsconfig.json
│       └── vite.config.ts
├── packages/
│   ├── ai/               # NestJS + LangChain + Ollama 后端分析引擎
│   │   ├── src/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── nest-cli.json
│   ├── metrics/          # Vite + TypeScript + rrweb 前端监控 SDK
│   │   ├── src/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   └── doc/              # RSPress + React 项目文档
│       ├── docs/
│       ├── package.json
│       └── rspress.config.ts
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

## 技术栈

- **Monorepo**: pnpm + turborepo
- **apps/example**: Vite + React + TypeScript
- **packages/ai**: NestJS + LangChain + Ollama
- **packages/metrics**: Vite + TypeScript + rrweb
- **packages/doc**: RSPress + React
- **代码质量**: ESLint + Prettier + Husky + Commitlint

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
# 启动所有开发服务器
pnpm dev

# 启动特定应用
pnpm --filter example dev    # http://localhost:3030
pnpm --filter ai dev         # http://localhost:3010
pnpm --filter doc dev        # http://localhost:3020
```

### 构建

```bash
# 构建所有项目
pnpm build

# 构建特定项目
pnpm --filter metrics build
pnpm --filter ai build
```

### 代码检查

```bash
# Lint 检查
pnpm lint

# 格式化代码
pnpm format
```

## 项目依赖关系

- `example` → 引用 `@g-ai-metrics/metrics`
- `metrics` → 引用 `@g-ai-metrics/ai`
- `doc` → 独立项目，用于文档展示

## 环境配置

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

## License

MIT
