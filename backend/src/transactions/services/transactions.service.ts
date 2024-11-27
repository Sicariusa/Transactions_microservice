import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionsDTO } from '../dto/createTransactions.dto';
import { Transactions } from '../TransactionsSchema';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { updateTransactionDTO } from '../dto/updateTransaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private readonly transactionRepo: Repository<Transactions>,
  ) {}

  /**
   * Create a transaction for a specific user
   */
  async addTrans(createDto: CreateTransactionsDTO): Promise<Transactions> {
    const transaction = this.transactionRepo.create(createDto);
    return await this.transactionRepo.save(transaction);
  }

  /**
   * Get all transactions for a specific user
   */
  async getAllTrans(userId: string): Promise<Transactions[]> {
    const transactions = await this.transactionRepo.find({ where: { userId } });
    if (transactions.length === 0) {
      throw new NotFoundException('No transactions found for this user');
    }
    return transactions;
  }

  /**
   * Get a specific transaction for a user
   */
  async getOneTrans(id: string, userId: string): Promise<Transactions> {
    const transaction = await this.transactionRepo.findOne({ where: { id, userId } });
    if (!transaction) {
      throw new NotFoundException('Transaction not found for this user');
    }
    return transaction;
  }

  /**
   * Delete a specific transaction for a user
   */
  async deleteTrans(id: string, userId: string): Promise<void> {
    const transaction = await this.transactionRepo.findOne({ where: { id, userId } });
    if (!transaction) {
      throw new NotFoundException('Transaction not found for this user');
    }
    await this.transactionRepo.delete({ id, userId });
  }

  /**
   * Delete all transactions for a specific user
   */
  async deleteAllTrans(userId: string): Promise<void> {
    const transactions = await this.transactionRepo.find({ where: { userId } });
    if (transactions.length === 0) {
      throw new NotFoundException('No transactions found for this user');
    }
    await this.transactionRepo.delete({ userId });
  }

  /**
   * Update a specific transaction for a user
   */
  async updateTrans(id: string, updateDto: updateTransactionDTO, userId: string): Promise<Transactions> {
    const transaction = await this.transactionRepo.findOne({ where: { id, userId } });
    if (!transaction) {
      throw new NotFoundException('Transaction not found for this user');
    }
    await this.transactionRepo.update({ id, userId }, updateDto);
    return await this.transactionRepo.findOne({ where: { id, userId } });
  }
}
