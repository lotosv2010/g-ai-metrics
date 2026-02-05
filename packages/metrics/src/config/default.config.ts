/**
 * Metrics SDK 默认配置
 */

import type { MetricsConfig } from '../types';

export const DEFAULT_CONFIG: Partial<MetricsConfig> = {
  apiEndpoint: 'http://localhost:3010',
  debug: false,
  enablePerformance: true,
  enableBusiness: true,
  enableBehavior: true,
  enableError: true,
  sampleRate: 1.0,
};
