/**
 * 3. 全链路追踪模块
 * Trace ID 透传, 父子 ID 关联
 */

export class TraceManager {
  private traceId: string;
  private parentId?: string;
  private appId: string;

  constructor(appId: string) {
    this.appId = appId;
    this.traceId = this.generateTraceId();
  }

  private generateTraceId(): string {
    return `${this.appId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // 创建子 Trace
  createChildTrace(): string {
    const childTrace = new TraceManager(this.appId);
    childTrace.setParentId(this.traceId);
    return childTrace.getTraceId();
  }

  // 设置父 ID
  setParentId(parentId: string): void {
    this.parentId = parentId;
  }

  // 获取当前 Trace ID
  getTraceId(): string {
    return this.traceId;
  }

  // 获取父 ID
  getParentId(): string | undefined {
    return this.parentId;
  }

  // 重置 Trace ID
  resetTraceId(): void {
    this.traceId = this.generateTraceId();
    this.parentId = undefined;
  }

  // 获取完整的 Trace 信息
  getTraceInfo(): { traceId: string; parentId?: string; appId: string; timestamp: number } {
    return {
      traceId: this.traceId,
      parentId: this.parentId,
      appId: this.appId,
      timestamp: Date.now(),
    };
  }
}
