import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RmqService } from './services/rmq.services';
import { TransactionsQueueListenerService } from './transactions/services/transactionsQueueListen.service';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Use manual listener
    const listener = app.get(TransactionsQueueListenerService);
    await listener.listenForResponses();


    app.enableCors({
        origin: 'http://localhost:3000', // Allow only the frontend origin
        credentials: true, // Allow credentials (cookies, headers, etc.)
      });
    app.useGlobalPipes(new ValidationPipe({ transform: true }));


    
    await app.listen(4000);
    console.log(`Transactions Service is running on http://localhost:4000`);
}

bootstrap();
