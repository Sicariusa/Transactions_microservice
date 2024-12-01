import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateTransactionsDTO } from '../dto/createTransactions.dto';
import { Transactions } from '../TransactionsSchema';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';

import { updateTransactionDTO } from '../dto/updateTransaction.dto';
import { FindTransactionDTO } from '../dto/FindTransactionDTO';



@Injectable()
export  class TransactionsService {
  protected  readonly logger: Logger
  constructor(
    @InjectRepository(Transactions)
    private readonly TransactionRepo: Repository<Transactions>,
   
    private readonly connection: Connection,
   
  ) {}

  async addTrans(createDto: CreateTransactionsDTO): Promise<Transactions> {
    const transaction = await this.TransactionRepo.save(createDto);
   
    return transaction;
  }

  async getAllTrans(): Promise<Transactions[]>{
    const allData =await this.TransactionRepo.find()
    return allData;
  }

  async getOneTrans(id: string): Promise<Transactions | null> {
    try {
      const transaction = await this.TransactionRepo.findOne({ where: { id } });
      return transaction || null;
    } catch (error) {
      console.error('Error getting one transaction:', error);
      throw new InternalServerErrorException('Error getting one transaction');
    }
  }

  async deleteTrans( id: string ){
    try {
      const transaction = await this.TransactionRepo.findOne({ where: { id } });
      if (!transaction) {
        return null;
      }
      await this.TransactionRepo.delete(id);
    } catch (error) {
      console.error('Error getting one transaction:', error);
      throw new InternalServerErrorException('Error getting one transaction');
    }
  }

  async deleteAllTrans(): Promise<void> {
    await this.TransactionRepo.clear();
  }

  async updateTrans(id: string, updateDto: updateTransactionDTO): Promise<Transactions> {
    try {
      const transaction = await this.TransactionRepo.findOne({ where: { id } });
      if (!transaction) {
        return null;
      }
      await this.TransactionRepo.update(id, updateDto);
    } catch (error) {
      console.error('Error getting one transaction:', error);
      throw new InternalServerErrorException('Error getting one transaction');
    }
  }


  async startTransaction() {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();
    return queryRunner;
  }

  

}
