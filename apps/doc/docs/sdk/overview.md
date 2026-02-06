# SDK 使用指南

本章节详细介绍 `@g-ai-metrics/metrics` SDK 的使用方法。

## 初始化

### 基础配置

```typescript
import MetricsSDK from '@g-ai-metrics/metrics';

const metrics = new MetricsSDK({
  apiEndpoint: 'http://localhost:3010',
  appId: 'your-app-id',
});
```

### 配置选项

| 参数          | 类型      | 必填 | 说明                           |
| ------------- | --------- | ---- | ------------------------------ |
| `apiEndpoint` | `string`  | 是   | 后端 API 地址                  |
| `appId`       | `string`  | 是   | 应用唯一标识                   |
| `debug`       | `boolean` | 否   | 是否开启调试模式，默认 `false` |

## 会话管理

### 开始会话

```typescript
metrics.startSession();
```

### 结束会话

```typescript
metrics.stopSession();
```

## 事件追踪

### 追踪自定义事件

```typescript
metrics.trackEvent('user_action', {
  action: 'click',
  target: 'submit_button',
  timestamp: Date.now(),
});
```

## 错误捕获

### 捕获错误

```typescript
try {
  // 你的代码
} catch (error) {
  metrics.captureError(error);
}
```

### 自动捕获全局错误

SDK 会自动捕获以下错误：

- 未捕获的 JavaScript 错误
- Promise rejection 错误
- 资源加载错误

## 性能指标

SDK 会自动采集以下性能指标：

- 页面加载时间
- 首次内容绘制 (FCP)
- 最大内容绘制 (LCP)
- 累积布局偏移 (CLS)

### 手动上报性能指标

```typescript
metrics.trackPerformance('custom_metric', 1234);
```
