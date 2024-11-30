import { Module } from '@nestjs/common';
import { TransactionsController } from './controller/transactions.controller';
import { TransactionsService } from './services/transactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transactions } from './TransactionsSchema';
import { AuthService } from './services/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transactions])],
  controllers: [TransactionsController],
  providers: [TransactionsService, AuthService],
})
export class TransactionsModule {}
