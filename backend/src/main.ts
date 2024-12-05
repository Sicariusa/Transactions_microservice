import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { RmqService } from './services/rmq.services';
import { setupRabbitMQ } from './rabbitmq-setup';
import { TransactionsQueueListenerService } from './transactions/services/transactionsQueueListen.service';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const rmqService = app.get<RmqService>(RmqService);

    // Enable global validation pipes
    app.useGlobalPipes(new ValidationPipe());
    await setupRabbitMQ();
    const listener = app.get(TransactionsQueueListenerService);
    await listener.listenForResponses();

    // Connect to RabbitMQ microservice for "transactions_service_queue"
    app.connectMicroservice(rmqService.getOptions('transactions_queue'));

    // Start microservices
    await app.startAllMicroservices();

    const configService = app.get<ConfigService>(ConfigService);
    console.log('Connecting to RabbitMQ at:', configService.get('RABBITMQ_URL'));

    // Start HTTP server
    await app.listen(configService.get('PORT') || 4000);
    console.log(`Transactions Service is running on: http://localhost:${configService.get('PORT') || 4000}`);
}

bootstrap();
