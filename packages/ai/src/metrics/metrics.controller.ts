import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import type { ReportData } from '@g-ai-metrics/metrics';

@Controller('api/metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  /**
   * 接收前端监控数据上报
   */
  @Post()
  async receiveMetrics(@Body() data: ReportData): Promise<{ success: boolean; message?: string }> {
    return this.metricsService.saveMetrics(data);
  }

  /**
   * 获取指定应用的监控数据
   */
  @Get()
  async getMetrics(
    @Query('appId') appId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ): Promise<any> {
    return this.metricsService.getMetrics(appId, startDate, endDate);
  }

  /**
   * 获取性能分析报告
   */
  @Get('performance')
  async getPerformanceReport(
    @Query('appId') appId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ): Promise<any> {
    return this.metricsService.getPerformanceReport(appId, startDate, endDate);
  }

  /**
   * 获取错误分析报告
   */
  @Get('errors')
  async getErrorReport(
    @Query('appId') appId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ): Promise<any> {
    return this.metricsService.getErrorReport(appId, startDate, endDate);
  }

  /**
   * 获取用户行为分析
   */
  @Get('behavior')
  async getBehaviorReport(
    @Query('appId') appId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ): Promise<any> {
    return this.metricsService.getBehaviorReport(appId, startDate, endDate);
  }

  /**
   * AI 智能分析
   */
  @Post('analyze')
  async analyzeWithAI(
    @Body() body: { appId: string; startDate?: string; endDate?: string; analysisType?: string }
  ): Promise<any> {
    return this.metricsService.analyzeWithAI(
      body.appId,
      body.startDate,
      body.endDate,
      body.analysisType
    );
  }
}
