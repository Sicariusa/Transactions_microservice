import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RmqService } from './services/rmq.services';
import { TransactionsQueueListenerService } from './transactions/services/transactionsQueueListen.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Use manual listener
    const listener = app.get(TransactionsQueueListenerService);
    await listener.listenForResponses();

    await app.listen(4000);
    console.log(`Transactions Service is running on http://localhost:4000`);
}

bootstrap();
