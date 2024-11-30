import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateTransactionsDTO } from '../dto/createTransactions.dto';
import { Transactions } from '../schema/TransactionsSchema';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { updateTransactionDTO } from '../dto/updateTransaction.dto';
import { AuthService } from './auth.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private readonly transactionRepo: Repository<Transactions>,
    private readonly authService: AuthService,
  ) {}

  async addTrans(createDto: CreateTransactionsDTO): Promise<Transactions> {
    const transaction = this.transactionRepo.create(createDto);
    return await this.transactionRepo.save(transaction);
  }

  async getAllTrans(userId: string): Promise<Transactions[]> {
    return await this.transactionRepo.find({ where: { userId } });
  }

  async getOneTrans(id: string, userId: string): Promise<Transactions | null> {
    return await this.transactionRepo.findOne({ where: { id, userId } });
  }

  async deleteTrans(id: string): Promise<void> {
    await this.transactionRepo.delete({ id });
  }

  async deleteAllTrans(userId: string): Promise<void> {
    await this.transactionRepo.delete({ userId });
  }

  async updateTrans(id: string, updateDto: updateTransactionDTO): Promise<Transactions> {
    await this.transactionRepo.update(id, updateDto);
    return await this.transactionRepo.findOne({ where: { id } });
  }

  async validateUserToken(token: string): Promise<any> {
    return await this.authService.validateToken(token);
  }
}
