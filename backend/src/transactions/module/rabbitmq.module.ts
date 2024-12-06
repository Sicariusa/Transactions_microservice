import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransactionsQueueListenerService } from '../services/transactionsQueueListen.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: 'auth_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  providers: [TransactionsQueueListenerService],
  controllers: [TransactionsQueueListenerService],
  exports: [ClientsModule], // Export ClientsModule to use in other modules
})
export class RabbitMQModule {}