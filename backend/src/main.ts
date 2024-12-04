import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqService } from './services/rmq.services';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    
    const rmqService = app.get<RmqService>(RmqService);

  app.useGlobalPipes(new ValidationPipe());

  app.connectMicroservice(rmqService.getOptions('transactions_queue'));
    
    // Log RabbitMQ URL
    console.log('Connecting to RabbitMQ at:', configService.get('RABBITMQ_URL'));
    
    await app.listen(configService.get('PORT') || 4000);
    console.log(`Application is running on: http://localhost:${configService.get('PORT') || 4000}`);
}
bootstrap();