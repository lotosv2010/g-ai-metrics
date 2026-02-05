export interface AppConfig {
  port: number;
  ollamaBaseUrl: string;
  ollamaModel: string;
}

export const appConfig = (): AppConfig => ({
  port: parseInt(process.env.PORT, 10) || 3010,
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
  ollamaModel: process.env.OLLAMA_MODEL || 'llama2',
});
