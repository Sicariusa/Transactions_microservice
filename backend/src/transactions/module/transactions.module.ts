import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsController } from '../controller/transactions.controller';
import { TransactionsService } from '../services/transactions.service';
import { AuthService } from '../services/auth.service';
import { Transactions } from '../schema/TransactionsSchema';

@Module({
  imports: [TypeOrmModule.forFeature([Transactions])],
  controllers: [TransactionsController],
  providers: [TransactionsService, AuthService],
})
export class TransactionsModule {}
