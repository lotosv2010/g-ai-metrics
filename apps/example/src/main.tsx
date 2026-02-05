import { createRoot } from 'react-dom/client';
import App from './App';
import MetricsSDK from '@g-ai-metrics/metrics';
import './index.css';

// 初始化监控 SDK
const metricsConfig = {
  appId: 'example-app',
  userId: 'user-123',
  debug: true,
};

const metricsSDK = new MetricsSDK(metricsConfig);

// 启动会话
metricsSDK.startSession();

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
