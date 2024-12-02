import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTransactionsDTO } from '../dto/createTransactions.dto';
import { updateTransactionDTO } from '../dto/updateTransaction.dto';
import { Transactions } from '../schema/TransactionsSchema';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectRepository(Transactions)
        private readonly transactionsRepository: Repository<Transactions>,
    ) {}

    async addTrans(createDto: CreateTransactionsDTO): Promise<Transactions> {
        if (!createDto.userId) {
            throw new UnauthorizedException('User ID is required');
        }

        const transaction = this.transactionsRepository.create(createDto);
        return await this.transactionsRepository.save(transaction);
    }

    async getAllTrans(): Promise<Transactions[]> {
        return await this.transactionsRepository.find();
    }

    async getOneTrans(id: string): Promise<Transactions> {
        return await this.transactionsRepository.findOne({ where: { id } });
    }

    async getUserTransactions(userId: string): Promise<Transactions[]> {
        return await this.transactionsRepository.find({ where: { userId } });
    }

    // ... rest of your service methods
    async deleteTrans(id: string): Promise<{ message: string }> {
        const transaction = await this.transactionsRepository.findOne({ where: { id } });

        if (!transaction) {
            throw new UnauthorizedException('Transaction not found');
        }

        await this.transactionsRepository.delete(id);
        return { message: 'Transaction deleted successfully' };
    }

    async updateTrans(id: string, updateDto: updateTransactionDTO): Promise<Transactions> {
        const transaction = await this.transactionsRepository.findOne({ where: { id } });

        if (!transaction) {
            throw new UnauthorizedException('Transaction not found');
        }

        await this.transactionsRepository.update(id, updateDto);
        return await this.transactionsRepository.findOne({ where: { id } });
    }
}
