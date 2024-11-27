import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'; // Import HttpModule
import { TransactionsController } from './controller/transactions.controller';
import { TransactionsService } from './services/transactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transactions } from './TransactionsSchema'; // Your Transactions entity

@Module({
  imports: [
    TypeOrmModule.forFeature([Transactions]), // Import Transactions entity
    HttpModule, // Add this to enable HttpService
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
