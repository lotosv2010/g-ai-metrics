/**
 * 监控指标类型定义
 */

// 1. 核心性能指标
export interface CorePerformanceMetrics {
  lcp: number; // Largest Contentful Paint (最大内容绘制)
  inp: number; // Interaction to Next Paint (交互到下一次绘制)
  cls: number; // Cumulative Layout Shift (累积布局偏移)
  fcp: number; // First Contentful Paint (首次内容绘制)
  ttfb: number; // Time to First Byte (首字节时间)
}

// 2. 业务增强指标
export interface BusinessMetrics {
  fmp: number; // First Meaningful Paint (首次有效绘制)
  tti: number; // Time to Interactive (可交互时间)
  secondOpenRate: number; // 秒开率
  arrivalRate: number; // 到达率
}

// 3. 全链路追踪
export interface TraceInfo {
  traceId: string; // Trace ID，用于全链路关联
  parentId?: string; // 父级 Trace ID
  timestamp: number; // 时间戳
}

// 4. 异常类型
export enum ErrorType {
  JS_RUNTIME_ERROR = 'js_runtime_error',
  RESOURCE_LOAD_FAILURE = 'resource_load_failure',
  HTTP_API_ERROR = 'http_api_error',
  UNHANDLED_REJECTION = 'unhandled_rejection',
  NETWORK_ERROR = 'network_error',
}

export interface ErrorInfo {
  type: ErrorType;
  message: string;
  stack?: string;
  url: string;
  userAgent: string;
  timestamp: number;
  traceId?: string;
}

// 5. 稳定性指标
export interface StabilityMetrics {
  whiteScreenRate: number; // 白屏率
  crashRate: number; // 崩溃率
  unresponsiveRate: number; // 交互无响应率
  errorRate: number; // 错误率
}

// 6. 开发体验指标
export interface DevExperienceMetrics {
  buildDuration: number; // 构建时长 (ms)
  buildSuccess: boolean; // 构建是否成功
  lintErrors: number; // Lint 错误数
  testCoverage: number; // 测试覆盖率
}

// 7. 代码质量指标
export interface CodeQualityMetrics {
  bundleSize: number; // Bundle 大小 (bytes)
  gzipSize: number; // Gzip 后大小 (bytes)
  lintErrors: number; // Lint 错误数
  lintWarnings: number; // Lint 警告数
  duplicateCodeRate: number; // 代码重复率
}

// 8. 用户行为指标
export interface UserBehaviorMetrics {
  pv: number; // 页面浏览量
  uv: number; // 独立访客数
  clickEvents: number; // 点击事件数
  customEvents: number; // 自定义事件数
  stayDuration: number; // 停留时长 (ms)
  bounceRate: number; // 跳出率
}

export enum EventType {
  PAGE_VIEW = 'page_view',
  CLICK = 'click',
  SCROLL = 'scroll',
  CUSTOM = 'custom',
}

export interface EventData {
  type: EventType;
  name?: string;
  data?: Record<string, any>;
  timestamp: number;
  traceId?: string;
  userId?: string;
  sessionId?: string;
}

// 通用配置
export interface MetricsConfig {
  apiEndpoint?: string;
  appId: string;
  debug?: boolean;
  userId?: string;
  enablePerformance?: boolean;
  enableBusiness?: boolean;
  enableBehavior?: boolean;
  enableError?: boolean;
  sampleRate?: number;
}

// 上报数据
export interface ReportData {
  traceId: string;
  timestamp: number;
  url: string;
  performance?: CorePerformanceMetrics;
  business?: BusinessMetrics;
  error?: ErrorInfo;
  stability?: StabilityMetrics;
  devExperience?: DevExperienceMetrics;
  codeQuality?: CodeQualityMetrics;
  behavior?: UserBehaviorMetrics;
  event?: EventData;
}
