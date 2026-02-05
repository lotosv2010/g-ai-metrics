/**
 * 7. 代码质量指标模块
 * Lint 错误/警告, Bundle size, 代码重复率
 */

import type { CodeQualityMetrics } from '../types';

export class CodeQualityCollector {
  private bundleSize: number = 0;
  private gzipSize: number = 0;
  private lintErrors: number = 0;
  private lintWarnings: number = 0;
  private duplicateCodeRate: number = 0;

  // 设置 Bundle 大小
  setBundleSize(size: number, gzip: number): void {
    this.bundleSize = size;
    this.gzipSize = gzip;
  }

  // 记录 Lint 结果
  recordLintResult(errors: number, warnings: number): void {
    this.lintErrors = errors;
    this.lintWarnings = warnings;
  }

  // 设置代码重复率
  setDuplicateCodeRate(rate: number): void {
    this.duplicateCodeRate = rate;
  }

  getMetrics(): CodeQualityMetrics {
    return {
      bundleSize: this.bundleSize,
      gzipSize: this.gzipSize,
      lintErrors: this.lintErrors,
      lintWarnings: this.lintWarnings,
      duplicateCodeRate: this.duplicateCodeRate,
    };
  }

  // 格式化大小显示
  formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
}
