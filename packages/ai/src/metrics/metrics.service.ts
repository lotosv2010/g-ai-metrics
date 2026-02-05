import { Injectable, Logger } from '@nestjs/common';
import { AnalysisService } from '../analysis/analysis.service';
import type {
  ReportData,
  CorePerformanceMetrics,
  ErrorInfo,
  UserBehaviorMetrics,
} from '@g-ai-metrics/metrics';

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);
  private metricsData: Map<string, ReportData[]> = new Map();

  constructor(private readonly analysisService: AnalysisService) {}

  /**
   * 保存监控数据
   */
  async saveMetrics(data: ReportData): Promise<{ success: boolean; message?: string }> {
    try {
      const appId = this.extractAppId(data);
      if (!appId) {
        return { success: false, message: 'Invalid app ID' };
      }

      if (!this.metricsData.has(appId)) {
        this.metricsData.set(appId, []);
      }
      this.metricsData.get(appId)!.push(data);

      this.logger.debug(`Metrics saved for app: ${appId}, traceId: ${data.traceId}`);
      return { success: true };
    } catch (error) {
      this.logger.error('Failed to save metrics', error);
      return { success: false, message: 'Internal server error' };
    }
  }

  /**
   * 获取监控数据
   */
  async getMetrics(
    appId: string,
    startDate?: string,
    endDate?: string
  ): Promise<{ appId: string; total: number; data: ReportData[] }> {
    let data = this.metricsData.get(appId) || [];

    // 按时间范围过滤
    if (startDate || endDate) {
      const start = startDate ? new Date(startDate).getTime() : 0;
      const end = endDate ? new Date(endDate).getTime() : Date.now();
      data = data.filter((item) => item.timestamp >= start && item.timestamp <= end);
    }

    return { appId, total: data.length, data };
  }

  /**
   * 获取性能分析报告
   */
  async getPerformanceReport(
    appId: string,
    startDate?: string,
    endDate?: string
  ): Promise<{
    appId: string;
    summary: CorePerformanceMetrics & { count: number };
    recommendations: string[];
  }> {
    const { data } = await this.getMetrics(appId, startDate, endDate);

    const performanceData = data
      .filter((item) => item.performance)
      .map((item) => item.performance) as CorePerformanceMetrics[];

    if (performanceData.length === 0) {
      return {
        appId,
        summary: {
          lcp: 0,
          inp: 0,
          cls: 0,
          fcp: 0,
          ttfb: 0,
          count: 0,
        },
        recommendations: [],
      };
    }

    const summary = {
      lcp: this.average(performanceData.map((d) => d.lcp)),
      inp: this.average(performanceData.map((d) => d.inp)),
      cls: this.average(performanceData.map((d) => d.cls)),
      fcp: this.average(performanceData.map((d) => d.fcp)),
      ttfb: this.average(performanceData.map((d) => d.ttfb)),
      count: performanceData.length,
    };

    const recommendations = this.generatePerformanceRecommendations(summary);

    return { appId, summary, recommendations };
  }

  /**
   * 获取错误分析报告
   */
  async getErrorReport(
    appId: string,
    startDate?: string,
    endDate?: string
  ): Promise<{
    appId: string;
    total: number;
    errorsByType: Record<string, number>;
    topErrors: ErrorInfo[];
  }> {
    const { data } = await this.getMetrics(appId, startDate, endDate);

    const errorData = data.filter((item) => item.error).map((item) => item.error) as ErrorInfo[];

    const errorsByType: Record<string, number> = {};
    errorData.forEach((error) => {
      const type = error.type;
      errorsByType[type] = (errorsByType[type] || 0) + 1;
    });

    const topErrors = errorData
      .sort((a, b) => {
        const countA = errorsByType[a.type];
        const countB = errorsByType[b.type];
        return countB - countA;
      })
      .slice(0, 10);

    return {
      appId,
      total: errorData.length,
      errorsByType,
      topErrors,
    };
  }

  /**
   * 获取用户行为分析
   */
  async getBehaviorReport(
    appId: string,
    startDate?: string,
    endDate?: string
  ): Promise<{
    appId: string;
    summary: UserBehaviorMetrics & { totalSessions: number };
  }> {
    const { data } = await this.getMetrics(appId, startDate, endDate);

    const behaviorData = data
      .filter((item) => item.behavior)
      .map((item) => item.behavior) as UserBehaviorMetrics[];

    const totalSessions = new Set(data.map((item) => item.traceId)).size;

    if (behaviorData.length === 0) {
      return {
        appId,
        summary: {
          pv: 0,
          uv: 0,
          clickEvents: 0,
          customEvents: 0,
          stayDuration: 0,
          bounceRate: 0,
          totalSessions: 0,
        },
      };
    }

    const summary = {
      pv: behaviorData.reduce((sum, d) => sum + d.pv, 0),
      uv: Math.max(...behaviorData.map((d) => d.uv)),
      clickEvents: behaviorData.reduce((sum, d) => sum + d.clickEvents, 0),
      customEvents: behaviorData.reduce((sum, d) => sum + d.customEvents, 0),
      stayDuration: this.average(behaviorData.map((d) => d.stayDuration)),
      bounceRate: this.average(behaviorData.map((d) => d.bounceRate)),
      totalSessions,
    };

    return { appId, summary };
  }

  /**
   * AI 智能分析
   */
  async analyzeWithAI(
    appId: string,
    startDate?: string,
    endDate?: string,
    analysisType = 'all'
  ): Promise<any> {
    // 收集数据
    const performanceReport = await this.getPerformanceReport(appId, startDate, endDate);
    const errorReport = await this.getErrorReport(appId, startDate, endDate);
    const behaviorReport = await this.getBehaviorReport(appId, startDate, endDate);

    // 构建分析提示
    const prompt = this.buildAnalysisPrompt(
      performanceReport,
      errorReport,
      behaviorReport,
      analysisType
    );

    // 调用 AI 分析服务
    return this.analysisService.analyze({
      appId,
      analysisType,
      data: {
        performance: performanceReport,
        errors: errorReport,
        behavior: behaviorReport,
      },
      prompt,
    });
  }

  private extractAppId(data: ReportData): string | null {
    // 从 traceId 中提取 appId (格式: appId-timestamp-random)
    if (!data.traceId) return null;
    const parts = data.traceId.split('-');
    return parts[0] || null;
  }

  private average(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, v) => sum + v, 0) / values.length;
  }

  private generatePerformanceRecommendations(
    metrics: CorePerformanceMetrics & { count: number }
  ): string[] {
    const recommendations: string[] = [];

    if (metrics.lcp > 2500) {
      recommendations.push('LCP (最大内容绘制) 过高，建议优化图片加载、减少资源大小');
    }

    if (metrics.inp > 200) {
      recommendations.push('INP (交互响应) 较慢，建议减少 JavaScript 执行时间');
    }

    if (metrics.cls > 0.1) {
      recommendations.push('CLS (布局偏移) 超标，建议为图片和广告预留空间');
    }

    if (metrics.ttfb > 600) {
      recommendations.push('TTFB (首字节时间) 较高，建议优化服务器响应或使用 CDN');
    }

    if (recommendations.length === 0) {
      recommendations.push('性能指标良好，继续保持');
    }

    return recommendations;
  }

  private buildAnalysisPrompt(
    performance: any,
    errors: any,
    behavior: any,
    analysisType: string
  ): string {
    return `
作为前端性能分析专家，请分析以下监控数据：

应用ID: ${performance.appId}
数据采样数: ${performance.summary.count}

性能指标:
- LCP: ${(performance.summary.lcp / 1000).toFixed(2)}s
- INP: ${(performance.summary.inp / 1000).toFixed(2)}s
- CLS: ${performance.summary.cls.toFixed(3)}
- FCP: ${(performance.summary.fcp / 1000).toFixed(2)}s
- TTFB: ${(performance.summary.ttfb / 1000).toFixed(2)}s

错误统计:
- 总错误数: ${errors.total}
- 错误类型分布: ${JSON.stringify(errors.errorsByType)}

用户行为:
- 总PV: ${behavior.summary.pv}
- 总UV: ${behavior.summary.uv}
- 点击事件: ${behavior.summary.clickEvents}
- 平均停留时长: ${(behavior.summary.stayDuration / 1000 / 60).toFixed(2)}分钟
- 跳出率: ${(behavior.summary.bounceRate * 100).toFixed(1)}%

请提供:
1. 性能问题诊断
2. 错误根因分析
3. 用户体验评估
4. 具体改进建议

分析类型: ${analysisType}
    `.trim();
  }
}
