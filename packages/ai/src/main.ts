import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port', 3010);

  // 启用 CORS
  app.enableCors({
    origin: true,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  await app.listen(port);
  console.log(`AI分析引擎服务启动成功: http://localhost:${port}`);
  console.log(`Ollama地址: ${configService.get<string>('ollamaBaseUrl')}`);
  console.log(`Ollama模型: ${configService.get<string>('ollamaModel')}`);
}
bootstrap();
