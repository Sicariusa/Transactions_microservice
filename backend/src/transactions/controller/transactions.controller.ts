import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Logger,
    NotFoundException,
    Param,
    Post,
    Patch,
    Req,
    Res,
    UnauthorizedException,
    UsePipes,
    ValidationPipe,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { TransactionsService } from '../services/transactions.service';
import { CreateTransactionsDTO } from '../dto/createTransactions.dto';
import { updateTransactionDTO } from '../dto/updateTransaction.dto';
import { Transactions } from '../schema/TransactionsSchema';
import { Request, Response } from 'express';

@Controller('transactions')
export class TransactionsController {
    private readonly logger = new Logger(TransactionsController.name);

    constructor(private readonly transactionService: TransactionsService) {}

    @Post('/create')
    async createTransaction(@Body() createDto: CreateTransactionsDTO, @Req() req: Request): Promise<Transactions> {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('Authorization token is required');
        }

        const validationResult = await this.transactionService.validateToken(token);
        if (!validationResult.isValid) {
            throw new UnauthorizedException('Token validation failed');
        }

        return await this.transactionService.addTransaction(createDto, validationResult.userId);
    }

    @Get('/export')
async exportUserTransactionsToCSV(@Req() req: any): Promise<{ message: string }> {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        throw new UnauthorizedException('Authorization token is required');
    }

    const validationResult = await this.transactionService.validateToken(token);
    if (!validationResult.isValid) {
        throw new UnauthorizedException('Token validation failed');
    }

    const userId = validationResult.userId;
    await this.transactionService.exportUserTransactionsToCSV(userId);

    return { message: 'CSV exported and sent to Analysis Microservice successfully' };
}


    @Get('/user')
    async getUserTransactions(@Req() req: Request): Promise<Transactions[]> {
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

    @Get('/:id')
    async getOneTransaction(@Param('id') id: string, @Req() req: Request): Promise<Transactions> {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('Authorization token is required');
        }

        const validationResult = await this.transactionService.validateToken(token);
        if (!validationResult.isValid) {
            throw new UnauthorizedException('Token validation failed');
        }

        if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
            throw new BadRequestException('Invalid transaction ID format');
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
    async deleteTransaction(@Param('id') id: string, @Req() req: Request): Promise<{ message: string }> {
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

        await this.transactionService.deleteTrans(id,validationResult.userId);
        return { message: 'Transaction deleted' };
    }

    @Patch('/update/:id')
    async updateTransaction(
        @Param('id') id: string,
        @Body() updateDTO: updateTransactionDTO,
        @Req() req: Request,
    ): Promise<Transactions> {
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

        return await this.transactionService.updateTrans(id, updateDTO,validationResult.userId);
    }
}
