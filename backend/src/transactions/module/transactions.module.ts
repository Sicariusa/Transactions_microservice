import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsController } from '../controller/transactions.controller';
import { Transactions } from '../schema/TransactionsSchema';
import { TransactionsService } from '../services/transactions.service';
import { RabbitMQModule } from './rabbitmq.module';
// Import RabbitMQModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Transactions]),
    RabbitMQModule, // Import RabbitMQModule here
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}