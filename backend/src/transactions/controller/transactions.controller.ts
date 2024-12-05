import { BadRequestException, Body, Controller, Delete, Get, Logger, NotFoundException, Param, Post, Put, Req, UnauthorizedException, UsePipes, ValidationPipe, UseGuards, Patch } from "@nestjs/common";
import { TransactionsService } from "../services/transactions.service";
import { CreateTransactionsDTO } from "../dto/createTransactions.dto";

import { Request } from "express";
import { updateTransactionDTO } from "../dto/updateTransaction.dto";
import { FindTransactionDTO } from "../dto/FindTransactionDTO";

import { Transactions } from "../schema/TransactionsSchema";
// import { AuthGuard } from "../guards/auth.guard";
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { PATTERNS } from '../../constants';

@Controller('transactions')
export class TransactionsController {
    private readonly logger = new Logger(TransactionsController.name);

    constructor(
        private readonly transactionService: TransactionsService,
        @Inject('ANALYSIS_SERVICE') private readonly client: ClientProxy,
        @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy, // Inject Auth Client,
    ) {}

    @Post('/create')
    async createTransaction(@Body() createDto: CreateTransactionsDTO, @Req() req: any): Promise<any> {
        const token = req.headers.authorization?.split(' ')[1]; // Extract Bearer token
        if (!token) {
            throw new Error('Authorization token is required');
        }

        const validationResult = await this.transactionService.validateToken(token);
        if (!validationResult.isValid) {
            throw new Error('Token validation failed');
        }

        const transaction = await this.transactionService.addTransaction(createDto, validationResult.userId);
        return transaction;
    }

    @Get("/justForTest")
    async getAllTransactions(@Req() req: any): Promise<Transactions[]> {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new Error('Authorization token is required');
        }

        const validationResult = await this.transactionService.validateToken(token);
        if (!validationResult.isValid) {
            throw new Error('Token validation failed');
        }

        return await this.transactionService.getAllTrans();
    }

    @Get('/:id')
async getOneTransaction(@Param('id') id: string, @Req() req: any): Promise<Transactions> {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        throw new UnauthorizedException('Authorization token is required');
    }

    const validationResult = await this.transactionService.validateToken(token);
    if (!validationResult.isValid) {
        throw new UnauthorizedException('Token validation failed');
    }

    const transaction = await this.transactionService.getOneTrans(id);
    if (!transaction) {
        throw new NotFoundException('Transaction not found');
    }

    if (transaction.userId !== validationResult.userId) {
        throw new UnauthorizedException('You can only access your own transactions');
    }

    return transaction;
}

@Delete('/delete/:id')
async deleteTransaction(@Param('id') id: string, @Req() req: any): Promise<{ message: string }> {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        throw new UnauthorizedException('Authorization token is required');
    }

    const validationResult = await this.transactionService.validateToken(token);
    if (!validationResult.isValid) {
        throw new UnauthorizedException('Token validation failed');
    }

    const transaction = await this.transactionService.getOneTrans(id);
    if (!transaction) {
        throw new NotFoundException('Transaction not found');
    }

    if (transaction.userId !== validationResult.userId) {
        throw new UnauthorizedException('You can only delete your own transactions');
    }

    await this.transactionService.deleteTrans(id);
    return { message: 'Transaction deleted' };
}
@Patch('/update/:id')
async updateTransaction(
    @Param('id') id: string,
    @Body() updateDTO: updateTransactionDTO,
    @Req() req: any
): Promise<Transactions> {
    // Validate the UUID
    if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
        throw new BadRequestException('Invalid transaction ID format');
    }

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        throw new UnauthorizedException('Authorization token is required');
    }

    const validationResult = await this.transactionService.validateToken(token);
    if (!validationResult.isValid) {
        throw new UnauthorizedException('Token validation failed');
    }

    const transaction = await this.transactionService.getOneTrans(id);
    if (!transaction) {
        throw new NotFoundException('Transaction not found');
    }

    if (transaction.userId !== validationResult.userId) {
        throw new UnauthorizedException('You can only update your own transactions');
    }

    return await this.transactionService.updateTrans(id, updateDTO);
}


@Get('/user')
async getUserTransactions(@Req() req: any): Promise<Transactions[]> {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        throw new UnauthorizedException('Authorization token is required');
    }

    const validationResult = await this.transactionService.validateToken(token);
    if (!validationResult.isValid) {
        throw new UnauthorizedException('Token validation failed');
    }

    const userId = validationResult.userId;
    this.logger.log(`Fetching transactions for userId: ${userId}`);

    return await this.transactionService.getUserTransactions(userId);
}


}

