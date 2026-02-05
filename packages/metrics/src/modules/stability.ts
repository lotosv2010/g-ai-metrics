/**
 * 5. 稳定性指标模块
 * 白屏率, Crash 率, 交互无响应率, 错误率
 */

import type { StabilityMetrics } from '../types';

export class StabilityCollector {
  private totalPageViews: number = 0;
  private whiteScreens: number = 0;
  private crashes: number = 0;
  private unresponsiveCount: number = 0;
  private errorCount: number = 0;
  private interactions: number = 0;

  // 白屏检测
  detectWhiteScreen(): void {
    if (typeof document === 'undefined') return;
    const beforeElements = document.body?.childElementCount || 0;
    setTimeout(() => {
      const afterElements = document.body?.childElementCount || 0;
      if (beforeElements === afterElements && afterElements === 0) {
        this.whiteScreens++;
      }
    }, 3000);
  }

  // Crash 率监测 (页面异常退出)
  reportCrash(): void {
    this.crashes++;
  }

  // 交互无响应检测
  monitorResponsiveness(): void {
    const startTime = Date.now();
    const checkResponsiveness = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed > 5000) {
        this.unresponsiveCount++;
      }
    };

    setTimeout(checkResponsiveness, 5000);
  }

  // 记录交互
  recordInteraction(): void {
    this.interactions++;
  }

  // 记录错误
  recordError(): void {
    this.errorCount++;
  }

  getMetrics(totalPageViews?: number): StabilityMetrics {
    const pv = totalPageViews || this.totalPageViews;
    return {
      whiteScreenRate: pv > 0 ? this.whiteScreens / pv : 0,
      crashRate: pv > 0 ? this.crashes / pv : 0,
      unresponsiveRate: this.interactions > 0 ? this.unresponsiveCount / this.interactions : 0,
      errorRate: pv > 0 ? this.errorCount / pv : 0,
    };
  }

  incrementPageViews(): void {
    this.totalPageViews++;
  }
}
