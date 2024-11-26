import { Injectable } from '@nestjs/common';
import { CreateTransactionsDTO } from '../dto/createTransactions.dto';
import { Transaction } from '../TransactionsSchema';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly TransactionRepo: Repository<Transaction>,
    private readonly jwtService: JwtService,
  ) {}

  async addTrans(createDto: CreateTransactionsDTO): Promise<Transaction> {
    const transaction = await this.TransactionRepo.save(createDto);

    return transaction;
  }
}
