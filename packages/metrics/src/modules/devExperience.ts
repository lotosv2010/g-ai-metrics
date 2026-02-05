/**
 * 6. 开发体验指标模块
 * 构建时长, 构建成功率, 测试覆盖率
 */

import type { DevExperienceMetrics } from '../types';

export class DevExperienceCollector {
  private builds: Array<{ duration: number; success: boolean }> = [];

  // 记录构建
  recordBuild(duration: number, success: boolean): void {
    this.builds.push({ duration, success });
  }

  // 记录测试覆盖率
  recordTestCoverage(_coverage: number): void {
    // 存储或上报测试覆盖率
  }

  // 获取平均构建时长
  getAverageBuildDuration(): number {
    if (this.builds.length === 0) return 0;
    const totalDuration = this.builds.reduce((sum: number, build) => sum + build.duration, 0);
    return totalDuration / this.builds.length;
  }

  // 获取构建成功率
  getBuildSuccessRate(): number {
    if (this.builds.length === 0) return 1;
    const successCount = this.builds.filter((b) => b.success).length;
    return successCount / this.builds.length;
  }

  getMetrics(): DevExperienceMetrics {
    return {
      buildDuration: this.getAverageBuildDuration(),
      buildSuccess: true,
      lintErrors: 0,
      testCoverage: 0,
    };
  }
}
