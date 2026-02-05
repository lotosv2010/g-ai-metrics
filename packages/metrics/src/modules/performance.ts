/**
 * 1. 核心性能指标模块
 * LCP, INP, CLS, FCP, TTFB
 */

import type { CorePerformanceMetrics } from '../types';

export class PerformanceCollector {
  private observer?: PerformanceObserver;

  constructor(private onMetrics?: (metrics: CorePerformanceMetrics) => void) {
    this.init();
  }

  private init(): void {
    if (typeof window === 'undefined' || !window.PerformanceObserver) {
      return;
    }

    this.observer = new PerformanceObserver(() => {
      const metrics = this.collectMetrics();
      if (metrics && this.onMetrics) {
        this.onMetrics(metrics);
      }
    });

    this.observer.observe({
      entryTypes: ['largest-contentful-paint', 'layout-shift', 'paint', 'event'],
    });
  }

  private collectMetrics(): CorePerformanceMetrics | null {
    // LCP (Largest Contentful Paint)
    const lcp = this.collectLCP();

    // INP (Interaction to Next Paint)
    const inp = this.collectINP();

    // CLS (Cumulative Layout Shift)
    const cls = this.collectCLS();

    // FCP (First Contentful Paint)
    const fcp = this.collectFCP();

    // TTFB (Time to First Byte)
    const ttfb = this.collectTTFB();

    return { lcp, inp, cls, fcp, ttfb };
  }

  private collectLCP(): number {
    const entries = performance.getEntriesByType('largest-contentful-paint');
    if (entries.length === 0) return 0;
    return entries[entries.length - 1].startTime;
  }

  private collectINP(): number {
    const entries = performance.getEntriesByType('event');
    const inpEntries = entries.filter((e: any) => {
      return e.duration > 50 && e.interactionId !== undefined && !e.processingStart;
    });
    if (inpEntries.length === 0) return 0;
    return Math.max(...inpEntries.map((e: any) => e.duration));
  }

  private collectCLS(): number {
    let cls = 0;
    const entries = performance.getEntriesByType('layout-shift');
    entries.forEach((entry: any) => {
      if (!entry.hadRecentInput) {
        cls += entry.value;
      }
    });
    return cls;
  }

  private collectFCP(): number {
    const entries = performance.getEntriesByType('paint');
    const fcpEntry = entries.find((e) => e.name === 'first-contentful-paint');
    return fcpEntry?.startTime || 0;
  }

  private collectTTFB(): number {
    const entries = performance.getEntriesByType('navigation');
    if (entries.length === 0) return 0;
    const navEntry = entries[0] as any;
    return navEntry.responseStart - navEntry.fetchStart;
  }

  destroy(): void {
    this.observer?.disconnect();
  }
}
