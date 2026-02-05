/**
 * 2. 业务增强指标模块
 * FMP, TTI, 秒开率, 到达率
 */

import type { BusinessMetrics } from '../types';

export class BusinessMetricsCollector {
  private startTime: number = 0;
  private pageLoadTimes: number[] = [];
  private successLoads: number = 0;
  private totalLoads: number = 0;
  private onReport?: (metrics: BusinessMetrics) => void;

  constructor(onReport?: (metrics: BusinessMetrics) => void) {
    this.onReport = onReport;
    this.startTime = performance.now();
    this.trackPageLoad();
  }

  // FMP (First Meaningful Paint) - 需要配合其他库或自定义实现
  reportFMP(fmp: number): void {
    const metrics: BusinessMetrics = {
      fmp,
      tti: 0,
      secondOpenRate: 0,
      arrivalRate: 0,
    };
    this.onReport?.(metrics);
  }

  // TTI (Time to Interactive)
  measureTTI(): number {
    const entries = performance.getEntriesByType('measure');
    const ttiEntry = entries.find((e: any) => e.name === 'tti');
    if (ttiEntry) {
      return ttiEntry.duration;
    }

    // 简单估算：长任务结束后
    let tti = this.startTime;
    const entriesLongTask = performance.getEntriesByType('longtask');
    if (entriesLongTask.length > 0) {
      const lastLongTask = entriesLongTask[entriesLongTask.length - 1];
      tti = lastLongTask.startTime + lastLongTask.duration;
    }
    return tti;
  }

  // 秒开率 (页面加载时间 < 1s 的比例)
  trackPageLoad(): void {
    const loadTime = performance.now() - this.startTime;
    this.pageLoadTimes.push(loadTime);
    this.totalLoads++;
    if (loadTime < 1000) {
      this.successLoads++;
    }
  }

  getSecondOpenRate(): number {
    if (this.totalLoads === 0) return 0;
    return this.successLoads / this.totalLoads;
  }

  // 到达率 (页面成功渲染的次数 / 总访问次数)
  private successfulArrivals: number = 0;
  private totalArrivals: number = 0;

  trackArrival(success: boolean): void {
    this.totalArrivals++;
    if (success) {
      this.successfulArrivals++;
    }
  }

  getArrivalRate(): number {
    if (this.totalArrivals === 0) return 0;
    return this.successfulArrivals / this.totalArrivals;
  }

  getMetrics(): BusinessMetrics {
    return {
      fmp: 0,
      tti: this.measureTTI(),
      secondOpenRate: this.getSecondOpenRate(),
      arrivalRate: this.getArrivalRate(),
    };
  }

  report(): void {
    const metrics = this.getMetrics();
    this.onReport?.(metrics);
  }
}
