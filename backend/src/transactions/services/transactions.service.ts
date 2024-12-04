import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTransactionsDTO } from '../dto/createTransactions.dto';
import { updateTransactionDTO } from '../dto/updateTransaction.dto';
import { Transactions } from '../schema/TransactionsSchema';
import { createObjectCsvWriter } from 'csv-writer';
import { join } from 'path';
import { promises as fs } from 'fs';

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



    async exportUserTransactionsToCSV(userId: string): Promise<string> {
        const transactions = await this.getUserTransactions(userId);
    
        if (transactions.length === 0) {
          throw new UnauthorizedException('No transactions found for this user');
        }
            // save in the exports directory
        
        //const exportDir = join(__dirname, '../../../../exports');
        const exportDir = join('C:/Users/abdo2/Documents/GitHub/Transactions_microservice/backend/exports');
        const filePath = join(exportDir, `${userId}_transactions.csv`);
    
        // Ensure the exports directory exists
        await fs.mkdir(exportDir, { recursive: true });
    
        const csvWriter = createObjectCsvWriter({
          path: filePath,
          header: [
            { id: 'id', title: 'ID' },
            { id: 'amount', title: 'Amount' },
            { id: 'vendorName', title: 'Vendor Name' },
            { id: 'transactionDate', title: 'Transaction Date' },
            { id: 'category', title: 'Category' },
            { id: 'paymentMethod', title: 'Payment Method' },
            { id: 'cardLastFourDigits', title: 'Card Last Four Digits' },
            { id: 'place', title: 'Place' },
            { id: 'notes', title: 'Notes' },
            { id: 'createdAt', title: 'Created At' },
            { id: 'updatedAt', title: 'Updated At' },
            { id: 'userId', title: 'User ID' },
          ],
        });
    
        await csvWriter.writeRecords(transactions);
    
        return filePath;
      }

    // async exportUserTransactionsToCSV(userId: string): Promise<string> {
    //     const transactions = await this.getUserTransactions(userId);

    //     if (transactions.length === 0) {
    //         throw new UnauthorizedException('No transactions found for this user');
    //     }

    //     const csvWriter = createObjectCsvWriter({
    //         path: join(__dirname, `../../../../exports/${userId}_transactions.csv`),
    //         header: [
    //             { id: 'id', title: 'ID' },
    //             { id: 'amount', title: 'Amount' },
    //             { id: 'type', title: 'Type' },
    //             { id: 'date', title: 'Date' },
    //             { id: 'userId', title: 'User ID' },
    //         ],
    //     });

    //     await csvWriter.writeRecords(transactions);

    //     return join(__dirname, `../../../../exports/${userId}_transactions.csv`);
    // }
}
