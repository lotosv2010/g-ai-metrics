/**
 * 4. 基础异常模块
 * JS Runtime Error, Resource Load Failure, HTTP API Errors, Unhandled Promise Rejection
 */

import { ErrorType, ErrorInfo } from '../types';

export class ErrorCollector {
  private errors: ErrorInfo[] = [];
  private onError?: (error: ErrorInfo) => void;

  constructor(onError?: (error: ErrorInfo) => void) {
    this.onError = onError;
    this.init();
  }

  private init(): void {
    if (typeof window === 'undefined') return;

    // JS Runtime Error
    window.addEventListener('error', (event) => {
      this.captureError({
        type: ErrorType.JS_RUNTIME_ERROR,
        message: event.message,
        stack: event.error?.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
      });
    });

    // Unhandled Promise Rejection
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError({
        type: ErrorType.UNHANDLED_REJECTION,
        message: event.reason?.message || String(event.reason) || 'Unhandled rejection',
        stack: (event.reason as any)?.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
      });
    });

    // Resource Load Failure
    window.addEventListener(
      'error',
      (event) => {
        if (event.target !== window) {
          this.captureResourceError(event.target as HTMLElement);
        }
      },
      true
    );
  }

  private captureResourceError(target: HTMLElement): void {
    const src = (target as any).src || (target as any).href;
    const tagName = (target as any).tagName;
    this.captureError({
      type: ErrorType.RESOURCE_LOAD_FAILURE,
      message: `Resource load failed: ${tagName} - ${src}`,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
    });
  }

  // 手动捕获 HTTP API Error
  captureHTTPError(url: string, status: number, message: string): void {
    this.captureError({
      type: ErrorType.HTTP_API_ERROR,
      message: `HTTP Error: ${status} - ${message}`,
      url: url,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
    });
  }

  private captureError(error: ErrorInfo): void {
    this.errors.push(error);
    if (this.onError) {
      this.onError(error);
    }
  }

  getErrors(): ErrorInfo[] {
    return this.errors;
  }

  getErrorCount(): number {
    return this.errors.length;
  }

  clearErrors(): void {
    this.errors = [];
  }
}
