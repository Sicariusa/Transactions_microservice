import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransactionsController } from '../controller/transactions.controller';
import { TransactionsService } from '../services/transactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Transactions } from '../schema/TransactionsSchema';
import { TransactionsQueueListenerService } from '../services/transactionsQueueListen.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
    imports: [
        TypeOrmModule.forFeature([Transactions]),
        ClientsModule.register([
            {
                name: 'ANALYSIS_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
                    queue: 'analysis_queue',
                    queueOptions: {
                        durable: false,
                        exclusive: false,
                        autoDelete: false,
                    },
                },
            },
            {
                name: 'AUTH_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
                    queue: 'auth_queue',
                    queueOptions: {
                        durable: false,
                    },
                },
            },
        ]),
        ConfigModule,
        EventEmitterModule.forRoot(),
    ],
    controllers: [TransactionsController],
    providers: [TransactionsService,TransactionsQueueListenerService],
    exports: [TransactionsQueueListenerService],
})
export class TransactionsModule {}