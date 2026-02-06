# AI 前端监控 Monorepo 项目

基于 pnpm + turborepo 的 Monorepo 项目，用于前端监控与智能分析。

## 开发方法论

本项目遵循以下开发方法论，确保高效、规范地推进项目进展：

### 概念 → 方案 → 实践 → Review

#### 1. 概念（Concept）

- **目标定义**：明确要解决的问题和预期达到的效果
- **需求分析**：梳理功能需求、性能需求、用户体验需求
- **可行性评估**：技术可行性、资源可行性、时间可行性
- **产出**：概念文档、需求规格说明

#### 2. 方案（Solution）

- **技术选型**：选择合适的技术栈和工具
- **架构设计**：系统架构、模块划分、接口设计
- **风险评估**：识别潜在风险，制定应对策略
- **产出**：技术方案文档、架构设计图、接口文档

#### 3. 实践（Practice）

- **MVP 最小实现单元**：先实现核心功能，快速验证
- **迭代开发**：基于 MVP 持续迭代，逐步完善功能
- **测试验证**：单元测试、集成测试、端到端测试
- **产出**：可运行的代码、测试报告

#### 4. Review（复盘）

- **代码审查**：同行代码 review，确保代码质量
- **性能优化**：分析性能瓶颈，优化关键路径
- **经验总结**：记录经验教训，形成最佳实践
- **产出**：改进建议、优化方案、技术文档

### MVP（最小可行产品）原则

- **核心价值优先**：优先实现最核心、最有价值的功能
- **快速验证**：用最小的成本验证想法的可行性
- **迭代优化**：基于反馈持续改进，而不是一次性做完美
- **团队协作**：产品经理、项目经理、开发团队紧密配合

### POC（概念验证）快速验证

对于新的想法或不确定的技术方案，先进行 POC：

1. **快速原型**：用最小成本搭建原型
2. **功能验证**：验证核心功能是否可行
3. **风险评估**：识别潜在问题
4. **决策依据**：为后续正式开发提供决策参考

### 角色职责

- **产品经理**：负责需求分析、优先级排序、验收标准
- **项目经理**：负责进度跟踪、资源协调、风险管理
- **开发团队**：负责技术实现、代码质量、测试验证

---

## 项目工程化设计

### 配置文件

- `pnpm-workspace.yaml` - Monorepo 工作空间配置，管理子包依赖关系
- `turbo.json` - Turbo 构建流水线配置，优化构建性能
- `package.json` - 根包配置，管理全局依赖和脚本

### 子包拆分（业务单元设计）

项目按业务功能拆分为独立的子包，每个包专注于特定领域：

```
packages/
├── metrics/          # 前端监控 SDK - 采集性能指标、异常、用户行为
├── ai/               # AI 分析引擎 - 智能数据分析、异常诊断、根因分析
├── insight/          # 数据洞察 - 可视化报表、趋势分析、仪表盘
├── core/             # 核心工具 - 通用工具函数、类型定义、常量
├── shared/           # 共享组件 - UI 组件库、业务组件
└── utils/            # 工具库 - 辅助函数、第三方工具封装
```

### Demo 项目

```
apps/
├── example/          # 完整示例 - 演示 SDK 集成效果
└── demo/             # 简单演示 - 快速上手指南
```

### 团队规范设计

- **ESLint** - JavaScript/TypeScript 代码规范检查
- **Biome** - 新一代代码格式化和检查工具（可选）
- **Prettier** - 代码格式化
- **Commitlint** - Git 提交信息规范
- **Husky** - Git Hooks 管理
- **lint-staged** - 暂存文件检查

### 团队构建流设计

- **tsup** - TypeScript/JavaScript 高效打包工具（主推）
- **esbuild** - 超快速打包工具，用于开发环境
- **Rollup** - 模块打包器，用于生产环境优化构建

### TypeScript

- 全栈 TypeScript 类型系统
- 统一的 tsconfig 基础配置
- 类型安全的项目间依赖

### CI/CD

- 自动化测试与构建
- 代码质量检查
- 自动发布流程

### 后端技术栈

- **Node.js/NestJS** - 服务端框架，提供 RESTful API
- **Python** - 数据分析、机器学习模型支持

## 项目结构

```
g-ai-metrics/
├── apps/
│   ├── example/          # Vite + React 完整示例项目
│   │   ├── src/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   └── demo/             # 简单演示项目
├── packages/
│   ├── ai/               # NestJS + LangChain + Ollama 后端分析引擎
│   │   ├── src/
│   │   │   ├── metrics/      # 指标收集服务
│   │   │   ├── analysis/     # AI 分析模块
│   │   │   └── config/       # 配置文件
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── nest-cli.json
│   ├── metrics/          # 前端监控 SDK
│   │   ├── src/
│   │   │   ├── modules/      # 功能模块
│   │   │   ├── types/        # 类型定义
│   │   │   ├── config/       # 配置文件
│   │   │   └── index.ts      # 入口文件
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── tsup.config.ts
│   ├── insight/          # 数据洞察模块（规划中）
│   ├── core/             # 核心工具库（规划中）
│   ├── shared/           # 共享组件（规划中）
│   └── utils/            # 工具函数库（规划中）
├── pnpm-workspace.yaml
├── turbo.json
├── eslint.config.js
├── commitlint.config.js
└── package.json
```

## 技术栈

### 前端

- **Monorepo**: pnpm + turborepo
- **开发框架**: Vite + React + TypeScript
- **代码规范**: ESLint + Prettier + Husky + Commitlint
- **构建工具**: tsup / esbuild / Rollup

### 后端

- **服务框架**: NestJS + Node.js
- **AI 能力**: LangChain + Ollama
- **数据分析**: Python（规划中）

### 文档

- **文档站点**: RSPress + React

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

# 运行测试
pnpm test
```

## 项目依赖关系

```
example (Demo)
  ↓ 引用
metrics (前端监控 SDK)
  ↓ 上报数据
ai (AI 分析引擎)
```

- `example` → 演示 `@g-ai-metrics/metrics` 的集成效果
- `metrics` → 将采集的数据上报到 `@g-ai-metrics/ai` 服务
- `ai` → 提供数据接收、存储和 AI 分析能力

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
