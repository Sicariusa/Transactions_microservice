import { Module } from '@nestjs/common';
import { Controller } from './transactions.controller';

@Module({
  controllers: [Controller]
})
export class TransactionsModule {}
