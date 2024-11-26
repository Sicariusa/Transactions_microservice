import { Module } from '@nestjs/common';
import { TransactionsController } from './controller/transactions.controller';
import { TransactionsService } from './services/transactions.service';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService]
})
export class TransactionsModule {}
