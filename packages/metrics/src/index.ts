/**
 * AI 前端监控 SDK
 * 用于采集前端性能指标、用户行为等数据
 */

import type { MetricsConfig, ReportData } from './types';
import {
  PerformanceCollector,
  BusinessMetricsCollector,
  TraceManager,
  ErrorCollector,
  StabilityCollector,
  DevExperienceCollector,
  CodeQualityCollector,
  BehaviorCollector,
  EventType,
} from './modules';

export type {
  MetricsConfig,
  CorePerformanceMetrics,
  BusinessMetrics,
  TraceInfo,
  ErrorType,
  ErrorInfo,
  StabilityMetrics,
  DevExperienceMetrics,
  CodeQualityMetrics,
  UserBehaviorMetrics,
  EventData,
  ReportData,
} from './types';

export { EventType };

export class MetricsSDK {
  private config: MetricsConfig;
  private sessionId: string;
  private performanceCollector?: PerformanceCollector;
  private businessMetricsCollector?: BusinessMetricsCollector;
  private traceManager: TraceManager;
  private errorCollector?: ErrorCollector;
  private stabilityCollector?: StabilityCollector;
  private devExperienceCollector?: DevExperienceCollector;
  private codeQualityCollector?: CodeQualityCollector;
  private behaviorCollector?: BehaviorCollector;

  constructor(config: MetricsConfig) {
    this.config = config;
    this.sessionId = this.generateSessionId();
    this.traceManager = new TraceManager(config.appId);
    this.init();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  private init(): void {
    if (this.config.debug) {
      console.log('Metrics SDK initialized', this.config);
    }

    // 1. 核心性能指标
    if (this.config.enablePerformance !== false) {
      this.performanceCollector = new PerformanceCollector((metrics) => {
        this.report({ performance: metrics });
      });
    }

    // 2. 业务增强指标
    this.businessMetricsCollector = new BusinessMetricsCollector();

    // 3. 全链路追踪
    this.traceManager = new TraceManager(this.config.appId);

    // 4. 基础异常
    if (this.config.enableError !== false) {
      this.errorCollector = new ErrorCollector((error) => {
        this.report({ error });
      });
    }

    // 5. 稳定性指标
    this.stabilityCollector = new StabilityCollector();

    // 6. 开发体验指标
    this.devExperienceCollector = new DevExperienceCollector();

    // 7. 代码质量指标
    this.codeQualityCollector = new CodeQualityCollector();

    // 8. 用户行为指标
    if (this.config.enableBehavior !== false) {
      this.behaviorCollector = new BehaviorCollector();
      this.initBehaviorTracking();
    }
  }

  // ==================== 1. 核心性能指标 ====================

  public getPerformanceMetrics() {
    return this.performanceCollector;
  }

  // ==================== 2. 业务增强指标 ====================

  public reportBusinessMetrics() {
    const metrics = this.businessMetricsCollector?.getMetrics();
    if (metrics) {
      this.report({ business: metrics });
    }
  }

  // ==================== 3. 全链路追踪 ====================

  public getTraceManager() {
    return this.traceManager;
  }

  public getTraceId(): string {
    return this.traceManager.getTraceId();
  }

  public createChildTrace(): string {
    return this.traceManager.createChildTrace();
  }

  // ==================== 4. 基础异常 ====================

  public captureHTTPError(url: string, status: number, message: string): void {
    this.errorCollector?.captureHTTPError(url, status, message);
  }

  public getErrors() {
    return this.errorCollector?.getErrors();
  }

  // ==================== 5. 稳定性指标 ====================

  public reportStabilityMetrics(): void {
    const metrics = this.stabilityCollector?.getMetrics();
    if (metrics) {
      this.report({ stability: metrics });
    }
  }

  public detectWhiteScreen(): void {
    this.stabilityCollector?.detectWhiteScreen();
  }

  // ==================== 6. 开发体验指标 ====================

  public recordBuild(duration: number, success: boolean): void {
    this.devExperienceCollector?.recordBuild(duration, success);
  }

  public getDevExperienceMetrics() {
    return this.devExperienceCollector?.getMetrics();
  }

  // ==================== 7. 代码质量指标 ====================

  public reportCodeQuality(bundleSize: number, gzipSize: number): void {
    this.codeQualityCollector?.setBundleSize(bundleSize, gzipSize);
    const metrics = this.codeQualityCollector?.getMetrics();
    if (metrics) {
      this.report({ codeQuality: metrics });
    }
  }

  public recordLintResult(errors: number, warnings: number): void {
    this.codeQualityCollector?.recordLintResult(errors, warnings);
  }

  // ==================== 8. 用户行为指标 ====================

  private clickHandler = () => {
    this.behaviorCollector?.recordClick();
  };

  private scrollHandler = () => {
    clearTimeout(this.scrollTimer);
    this.scrollTimer = setTimeout(() => {
      this.trackEvent(EventType.SCROLL);
    }, 300);
  };

  private initBehaviorTracking(): void {
    if (!this.behaviorCollector) return;

    // 点击事件
    document.addEventListener('click', this.clickHandler, true);

    // 滚动事件
    document.addEventListener('scroll', this.scrollHandler);
  }

  public trackEvent(type: EventType, data?: Record<string, any>): void {
    if (this.behaviorCollector) {
      if (type === EventType.CLICK) {
        this.behaviorCollector.recordClick();
      } else if (type === EventType.CUSTOM) {
        this.behaviorCollector.recordCustomEvent();
      }

      this.report({
        event: {
          type,
          data,
          timestamp: Date.now(),
          traceId: this.traceManager.getTraceId(),
          userId: this.config.userId,
          sessionId: this.sessionId,
        },
      });
    }
  }

  public trackPageView(): void {
    this.behaviorCollector?.incrementPV(this.config.userId);
    this.trackEvent(EventType.PAGE_VIEW);
  }

  public getUserBehaviorMetrics() {
    return this.behaviorCollector?.getMetrics();
  }

  // ==================== 会话管理 ====================

  public startSession(): void {
    this.sessionId = this.generateSessionId();
    this.traceManager.resetTraceId();
    this.trackPageView();
    this.stabilityCollector?.incrementPageViews();

    if (this.config.debug) {
      console.log('Session started:', this.sessionId);
    }
  }

  public stopSession(): void {
    this.behaviorCollector?.recordBounce(this.isBounce());

    if (this.config.debug) {
      console.log('Session stopped:', this.sessionId);
    }
  }

  private isBounce(): boolean {
    const behavior = this.behaviorCollector?.getMetrics();
    return (behavior?.pv || 0) === 1;
  }

  // ==================== 数据上报 ====================

  private async report(data: Partial<ReportData>): Promise<void> {
    if (Math.random() > (this.config.sampleRate || 1)) {
      return;
    }

    const reportData: ReportData = {
      traceId: this.traceManager.getTraceId(),
      timestamp: Date.now(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      ...data,
    };

    if (this.config.debug) {
      console.log('Reporting metrics:', reportData);
    }

    try {
      await fetch(`${this.config.apiEndpoint}/api/metrics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
        keepalive: true,
      });
    } catch (error) {
      if (this.config.debug) {
        console.error('Failed to report metrics:', error);
      }
    }
  }

  private scrollTimer?: ReturnType<typeof setTimeout>;

  public destroy(): void {
    this.performanceCollector?.destroy();
    if (typeof document !== 'undefined') {
      document.removeEventListener('click', this.clickHandler);
      document.removeEventListener('scroll', this.scrollHandler);
    }
  }
}

export default MetricsSDK;
