import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateTransactionsDTO } from '../dto/createTransactions.dto';
import { Transactions } from '../TransactionsSchema';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { updateTransactionDTO } from '../dto/updateTransaction.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private readonly transactionRepo: Repository<Transactions>,
    private readonly httpService: HttpService,
  ) {}

  /**
   * Validate Token
   */
  async validateToken(token: string): Promise<string> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${process.env.AUTH_SERVICE_URL}/auth/validateToken`, { token }),
      );
      const userData = response.data;
      if (!userData || !userData.sub) {
        throw new UnauthorizedException('Invalid or expired token');
      }
      return userData.sub; // Return userId from token
    } catch (error) {
      throw new UnauthorizedException('Token validation failed');
    }
  }

  /**
   * Create a Transaction
   */
  async createTransaction(createDto: CreateTransactionsDTO, token: string): Promise<Transactions> {
    const userId = await this.validateToken(token);
    createDto.userId = userId; // Assign the userId to the DTO
    return this.transactionRepo.save(createDto as DeepPartial<Transactions>);
  }

  /**
   * Get All Transactions for a User
   */
  async getAllTrans(userId: string): Promise<Transactions[]> {
    return this.transactionRepo.find({ where: { userId } });
  }

  /**
   * Get a Single Transaction for a User
   */
  async getOneTrans(id: string, userId: string): Promise<Transactions> {
    const transaction = await this.transactionRepo.findOne({ where: { id, userId } });
    if (!transaction) {
      throw new NotFoundException('Transaction not found for this user');
    }
    return transaction;
  }

  /**
   * Delete a Single Transaction for a User
   */
  async deleteTrans(id: string, userId: string): Promise<void> {
    const transaction = await this.transactionRepo.findOne({ where: { id, userId } });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    await this.transactionRepo.delete({ id, userId });
  }

  /**
   * Delete All Transactions for a User
   */
  async deleteAllTrans(userId: string): Promise<void> {
    await this.transactionRepo.delete({ userId });
  }

  /**
   * Update a Transaction for a User
   */
  async updateTrans(id: string, updateDto: updateTransactionDTO, userId: string): Promise<Transactions> {
    const transaction = await this.transactionRepo.findOne({ where: { id, userId } });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    await this.transactionRepo.update({ id, userId }, updateDto);
    return this.transactionRepo.findOne({ where: { id, userId } });
  }
}
