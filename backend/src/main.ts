import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Health check endpoint
  app.getHttpAdapter().getInstance().get('/health', (req, res) => res.json({ status: 'ok' }));
  
  // Configure CORS for specific services
  app.enableCors({
    origin: [
      process.env.USER_SERVICE_URL,
      process.env.ANALYSIS_SERVICE_URL,
      // Add localhost for development
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  await app.listen(process.env.PORT || 3000);
}
bootstrap();