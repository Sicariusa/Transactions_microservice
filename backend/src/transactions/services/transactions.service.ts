import { Injectable } from '@nestjs/common';
import { CreateTransactionsDTO } from '../dto/createTransactions.dto';
import { Transactions } from '../TransactionsSchema';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { updateTransactionDTO } from '../dto/updateTransaction.dto';
import { ExternalService } from 'src/external.service';


@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private readonly TransactionRepo: Repository<Transactions>,
    private readonly externalService: ExternalService
  ) {}

  async addTrans(createDto: CreateTransactionsDTO): Promise<Transactions> {
    const transaction = await this.TransactionRepo.save(createDto);
    await this.externalService.notifyAnalytics(transaction);
    return transaction;
  }

  async getAllTrans(): Promise<Transactions[]>{
    const allData =await this.TransactionRepo.find()
    return allData;
  }

  async getOneTrans( id : string ): Promise<Transactions[]>{
    const OneData = await this.TransactionRepo.find({ where: { id } })
    return OneData
  }

  async deleteTrans( id: string ){
    const del = await this.TransactionRepo.delete({ id })
    return del
  }

  async deleteAllTrans(): Promise<void> {
    await this.TransactionRepo.clear();
  }

  async updateTrans(id: string, updateDto: updateTransactionDTO): Promise<Transactions> {
    await this.TransactionRepo.update(id, updateDto);
    const updatedTransaction = await this.TransactionRepo.findOne({ where: { id } });
    return updatedTransaction;
  }
}
