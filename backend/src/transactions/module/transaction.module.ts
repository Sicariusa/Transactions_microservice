import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransactionsController } from '../controller/transactions.controller';
import { TransactionsService } from '../services/transactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Transactions } from '../schema/TransactionsSchema';

@Module({
    imports: [
        TypeOrmModule.forFeature([Transactions]),
        ClientsModule.register([
            {
                name: 'ANALYSIS_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: ['amqp://localhost:5672'],
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
                    urls: ['amqp://localhost:5672'],
                    queue: 'auth_queue',
                    queueOptions: {
                        durable: false,
                    },
                },
            },
        ]),
        ConfigModule,
    ],
    controllers: [TransactionsController],
    providers: [TransactionsService],
})
export class TransactionsModule {}