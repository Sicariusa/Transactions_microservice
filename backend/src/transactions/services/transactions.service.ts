import { Injectable, Logger, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactions } from '../schema/TransactionsSchema';
import { CreateTransactionsDTO } from '../dto/createTransactions.dto';
import { updateTransactionDTO } from '../dto/updateTransaction.dto';
import { createObjectCsvWriter } from 'csv-writer';
import * as path from 'path';
import { promises as fs } from 'fs';
import * as amqp from 'amqplib';
import { EventEmitter2 } from 'eventemitter2';

@Injectable()
export class TransactionsService {
    private readonly logger = new Logger(TransactionsService.name);

    constructor(
        @InjectRepository(Transactions)
        private readonly transactionsRepository: Repository<Transactions>,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    private generateCorrelationId(): string {
        return Math.random().toString(36).substring(2, 15);
    }

    async validateToken(token: string): Promise<any> {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();
        const requestQueue = 'auth_queue';
        const responseEvent = 'authResponse';

        await channel.assertQueue(requestQueue, { durable: true });

        const correlationId = this.generateCorrelationId();
        const flag=true
        const message = { token ,flag};

        channel.sendToQueue(requestQueue, Buffer.from(JSON.stringify(message)), { correlationId });
        this.logger.log(`Token sent to queue "${requestQueue}" with correlationId: ${correlationId}`);

        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                this.logger.error('Timeout waiting for Auth Service response');
                reject(new Error('Timeout waiting for Auth Service response'));
            }, 30000);

            this.eventEmitter.once(responseEvent, ({ correlationId: respCorrelationId, response }) => {
                if (respCorrelationId === correlationId) {
                    clearTimeout(timeout);
                    this.logger.log(`Received response for correlationId: ${correlationId}`);
                    resolve(response);
                }
            });
        });
    }

    async addTransaction(createDto: CreateTransactionsDTO, userId: string): Promise<Transactions> {
        const transaction = this.transactionsRepository.create({ ...createDto, userId });
        await this.transactionsRepository.save(transaction);
        this.exportUserTransactionsToCSV(userId);
        return transaction;
    }

    async getAllTrans(): Promise<Transactions[]> {
        return await this.transactionsRepository.find();
    }

    async getOneTrans(id: string): Promise<Transactions> {
        if (!this.isValidUUID(id)) {
            throw new BadRequestException(`Invalid id format: ${id}`);
        }
        return await this.transactionsRepository.findOne({ where: { id } });
    }

    async getUserTransactions(userId: string): Promise<Transactions[]> {
        if (!this.isValidUUID(userId)) {
            throw new BadRequestException(`Invalid userId format: ${userId}`);
        }
        return await this.transactionsRepository.find({ where: { userId } });
    }

    async deleteTrans(id: string,userId: string): Promise<void> {
        const transaction = await this.getOneTrans(id);
        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }
        await this.exportUserTransactionsToCSV(userId);
        await this.transactionsRepository.delete(id);
    }

    async updateTrans(id: string, updateDto: updateTransactionDTO,userId: string): Promise<Transactions> {
        const transaction = await this.getOneTrans(id);
        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }
        await this.transactionsRepository.update(id, updateDto);
        await this.exportUserTransactionsToCSV(userId);
        return await this.transactionsRepository.findOne({ where: { id } });
    }

    async exportUserTransactionsToCSV(userId: string): Promise<string> {
        const transactions = await this.getUserTransactions(userId);
        if (transactions.length === 0) throw new UnauthorizedException('No transactions found');

        const exportDir = path.join(process.cwd(), 'backend/exports');
        const filePath = path.join(exportDir, `${userId}_transactions.csv`);
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
                { id: 'place', title: 'Place' },
                { id: 'userId', title: 'User ID' },
            ],
        });

        const formattedTransactions = transactions.map((t) => ({
            id: t.id,
            amount: t.amount,
            vendorName: t.vendorName,
            transactionDate: t.transactionDate
                ? new Date(t.transactionDate).toISOString().slice(0, 19).replace('T', ' ')
                : '',
            category: t.category,
            paymentMethod: t.paymentMethod,
            place: t.place,
            userId: t.userId,
        }));

        await csvWriter.writeRecords(formattedTransactions);
        this.logger.log(`CSV exported to ${filePath}`);

        const csvData = await fs.readFile(filePath, { encoding: 'base64' });
        await this.sendCsvToAnalysisMicroservice(userId, csvData);

        return filePath;
    }

    private async sendCsvToAnalysisMicroservice(userId: string, csvData: string): Promise<void> {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();
        const queue = 'analysis_queue';

        await channel.assertQueue(queue, { durable: true });

        const CHUNK_SIZE = 1024; // 1 KB
        const totalChunks = Math.ceil(csvData.length / CHUNK_SIZE);

        for (let i = 0; i < totalChunks; i++) {
            const chunk = csvData.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);

            const message = {
                userId,
                chunkIndex: i + 1,
                totalChunks,
                chunk,
            };
            console.log(message);
            channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        this.logger.log(`CSV data for userId: ${userId} sent in ${totalChunks} chunks`);
        await channel.close();
        await connection.close();
    }

    private delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    private isValidUUID(id: string): boolean {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(id);
    }
}
