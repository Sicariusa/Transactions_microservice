import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Req, UnauthorizedException } from "@nestjs/common";
import { TransactionsService } from "../services/transactions.service";
import { CreateTransactionsDTO } from "../dto/createTransactions.dto";
import { Transactions } from "../schema/TransactionsSchema";
import { Request } from "express";
import { updateTransactionDTO } from "../dto/updateTransaction.dto";
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionService: TransactionsService,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Post('/create')
  async createTransaction(@Body() createDto: CreateTransactionsDTO, @Req() req: Request): Promise<Transactions> {
    const token = req.headers['authorization'];
    const user = await this.transactionService.validateUserToken(token);
    
    if (!user) {
      throw new UnauthorizedException('You are not authorized to perform this action');
    }

    createDto.userId = user.id;
    const transaction = await this.transactionService.addTrans(createDto);
    
    await this.transactionService.notifyAuthService(transaction.id);

    return transaction;
  }

  @Get()
  async getAllTransactions(@Req() req: Request): Promise<Transactions[]> {
    const token = req.headers['authorization'];
    const user = await this.transactionService.validateUserToken(token);
    
    if (!user) {
      throw new UnauthorizedException('You are not authorized to perform this action');
    }

    try {
      const data = await this.transactionService.getAllTrans(user.id);
      if (!data) {
        throw new NotFoundException('No Transactions Found');
      }
      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('/:id')
  async getOneTransaction(@Param('id') id: string, @Req() req: Request): Promise<Transactions> {
    const token = req.headers['authorization'];
    const user = await this.transactionService.validateUserToken(token);
    
    if (!user) {
      throw new UnauthorizedException('You are not authorized to perform this action');
    }

    try {
      const transaction = await this.transactionService.getOneTrans(id, user.id);
      if (!transaction) {
        throw new NotFoundException('No transaction Found');
      }
      return transaction;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete('/delete/:id')
  async deleteTransaction(@Param('id') id: string, @Req() req: Request): Promise<{ message: string }> {
    const token = req.headers['authorization'];
    const user = await this.transactionService.validateUserToken(token);
    
    if (!user) {
      throw new UnauthorizedException('You are not authorized to perform this action');
    }

    try {
      const transaction = await this.transactionService.getOneTrans(id, user.id);
      if (!transaction) {
        throw new NotFoundException('Transaction not found');
      }

      await this.transactionService.deleteTrans(id);
      return { message: 'Transaction Deleted' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete('/deleteAll')
  async deleteAllTransactions(@Req() req: Request): Promise<{ message: string }> {
    const token = req.headers['authorization'];
    const user = await this.transactionService.validateUserToken(token);
    
    if (!user) {
      throw new UnauthorizedException('You are not authorized to perform this action');
    }

    try {
      await this.transactionService.deleteAllTrans(user.id);
      return { message: 'All Transactions Deleted' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put('/update/:id')
  async updateTransaction(@Param('id') id: string, @Body() updateDTO: updateTransactionDTO, @Req() req: Request): Promise<Transactions> {
    const token = req.headers['authorization'];
    const user = await this.transactionService.validateUserToken(token);
    
    if (!user) {
      throw new UnauthorizedException('You are not authorized to perform this action');
    }

    try {
      const transaction = await this.transactionService.getOneTrans(id, user.id);
      if (!transaction) {
        throw new NotFoundException('Transaction not found');
      }

      const updatedTransaction = await this.transactionService.updateTrans(id, updateDTO);
      return updatedTransaction;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
