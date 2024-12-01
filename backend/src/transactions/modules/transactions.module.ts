import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsController } from '../controller/transactions.controller';
import { TransactionsService } from '../services/transactions.service';
import { Transactions } from '../TransactionsSchema';


@Module({
  imports: [TypeOrmModule.forFeature([Transactions])],
  controllers: [TransactionsController],
  providers: [TransactionsService]
})
export class TransactionsModule {}
