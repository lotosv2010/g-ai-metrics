# 配置选项

## SDK 配置

### 完整配置示例

```typescript
const metrics = new MetricsSDK({
  apiEndpoint: 'http://localhost:3001',
  appId: 'your-app-id',
  debug: false,

  // 采样配置
  sampling: {
    error: 1.0,
    performance: 0.1,
    behavior: 0.5,
  },

  // 上传配置
  upload: {
    batchSize: 10,
    interval: 5000,
  },

  // 忽略配置
  ignore: {
    errors: ['ResizeObserver loop limit exceeded'],
    urls: ['localhost', '127.0.0.1'],
  },
});
```

### 配置说明

#### 采样配置 (sampling)

- `error`: 错误采样率 (0-1)，默认 1.0
- `performance`: 性能数据采样率 (0-1)，默认 0.1
- `behavior`: 行为数据采样率 (0-1)，默认 0.5

#### 上传配置 (upload)

- `batchSize`: 批量上传数量，默认 10
- `interval`: 上传间隔 (ms)，默认 5000

#### 忽略配置 (ignore)

- `errors`: 忽略的错误信息列表
- `urls`: 忽略的 URL 列表

## AI 引擎配置

### 环境变量

AI 服务通过 `.env` 文件配置环境变量。

#### 创建配置文件

```bash
cd packages/ai
cp .env.example .env
```

#### 配置说明

在 `packages/ai/.env` 中配置：

```env
PORT=3010
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2
```

| 参数              | 说明            | 默认值                 |
| ----------------- | --------------- | ---------------------- |
| `PORT`            | 服务端口        | 3010                   |
| `OLLAMA_BASE_URL` | Ollama 服务地址 | http://localhost:11434 |
| `OLLAMA_MODEL`    | 使用的模型名称  | llama2                 |

### 配置说明

- `PORT`: 服务端口，默认 3001
- `OLLAMA_BASE_URL`: Ollama 服务地址
- `OLLAMA_MODEL`: 使用的模型名称
