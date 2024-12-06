import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';

 
import { Transactions } from './transactions/schema/TransactionsSchema';
import { RmqService } from './services/rmq.services';
import { TransactionsModule } from './transactions/module/transaction.module';
import { QUEUE_NAME } from './constants';
import { TransactionsQueueListenerService } from './transactions/services/transactionsQueueListen.service';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [Transactions],
        synchronize: true,
        ssl: {
          rejectUnauthorized: false,
        },
      }),
      inject: [ConfigService],
    }),
    ClientsModule.register([
      {
        name: 'ANALYSIS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: QUEUE_NAME,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    TransactionsModule,
  ],
  providers: [RmqService],
})
export class AppModule {}
