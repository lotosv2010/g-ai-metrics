/**
 * 8. 用户行为指标模块
 * PV/UV, 点击事件, 自定义事件, 停留时长, 跳出率
 */

import type { UserBehaviorMetrics } from '../types';

export class BehaviorCollector {
  private pv: number = 0;
  private uvSet: Set<string> = new Set();
  private clickEvents: number = 0;
  private customEvents: number = 0;
  private totalEvents: number = 0;
  private singlePageViewVisits: number = 0;
  private startTime: number = 0;

  constructor() {
    this.startTime = Date.now();
  }

  // 记录 PV
  incrementPV(userId?: string): void {
    this.pv++;
    if (userId && this.uvSet) {
      this.uvSet.add(userId);
    }
  }

  // 获取 UV
  getUV(): number {
    return this.uvSet.size;
  }

  // 记录点击事件
  recordClick(): void {
    this.clickEvents++;
    this.totalEvents++;
  }

  // 记录自定义事件
  recordCustomEvent(): void {
    this.customEvents++;
    this.totalEvents++;
  }

  // 获取停留时长
  getStayDuration(): number {
    return Date.now() - this.startTime;
  }

  // 计算跳出率 (只浏览一个页面就离开的比例)
  recordBounce(isBounce: boolean): void {
    if (isBounce) {
      this.singlePageViewVisits++;
    }
  }

  getBounceRate(): number {
    return this.pv > 0 ? this.singlePageViewVisits / this.pv : 0;
  }

  // 获取行为指标
  getMetrics(): UserBehaviorMetrics {
    return {
      pv: this.pv,
      uv: this.getUV(),
      clickEvents: this.clickEvents,
      customEvents: this.customEvents,
      stayDuration: this.getStayDuration(),
      bounceRate: this.getBounceRate(),
    };
  }

  // 重置
  reset(): void {
    this.pv = 0;
    this.uvSet.clear();
    this.clickEvents = 0;
    this.customEvents = 0;
    this.totalEvents = 0;
    this.singlePageViewVisits = 0;
    this.startTime = Date.now();
  }
}
