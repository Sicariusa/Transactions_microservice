import { BadRequestException, Body, Controller, Delete, Get, Logger, NotFoundException, Param, Post, Put, Req, UnauthorizedException, UsePipes, ValidationPipe, UseGuards } from "@nestjs/common";
import { TransactionsService } from "../services/transactions.service";
import { CreateTransactionsDTO } from "../dto/createTransactions.dto";

import { Request } from "express";
import { updateTransactionDTO } from "../dto/updateTransaction.dto";
import { FindTransactionDTO } from "../dto/FindTransactionDTO";

import { Transactions } from "../schema/TransactionsSchema";
import { AuthGuard } from "../guards/auth.guard";


@Controller('transactions')
//@UseGuards(AuthGuard)
export class TransactionsController {
  protected  readonly logger: Logger
  constructor(private readonly transactionService: TransactionsService) {}
  
  @Post('/create')
  async createTransaction(
    @Body() createDto: CreateTransactionsDTO,
    @Req() req: any
  ): Promise<Transactions> {
    const userId = req.user?.id || createDto.userId;
    return this.transactionService.addTrans({
      ...createDto,
      userId,
    });
  }
  
  @Get()
  async getAllTransactions(@Req() req: Request,   ): Promise<Transactions[]> {
    // const user = req.user.sub
    // if (user !== id){
    //   throw new UnauthorizedException('You can only access your data')
    // }
    try {
      const data = await this.transactionService.getAllTrans()
      if(!data){
        throw new NotFoundException('No Transactions Found')
      }
      return data
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @Get('/:id')
  async getOneTransaction(@Param('id') id: string) {
    try {
      const OneData = await this.transactionService.getOneTrans(id)
      if(!OneData){
        throw new NotFoundException('No transaction Found')
      }
      return OneData
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  // delete
  @Delete('/delete/:id')
  async deleteTransaction(@Param('id') id: string , checkDTO: FindTransactionDTO): Promise<{ message: string }> {
    // const user = req.user.sub
    // if (user !== id){
    //   throw new UnauthorizedException('You can only delete your data')
    // }
    try {
      const OneData = this.transactionService.getOneTrans(id)
      if(!OneData){
        throw new NotFoundException('Transaction not found')
      } 

      await this.transactionService.deleteTrans(id);
      return { message: 'Transaction Deleted' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

 

  @Put('/update/:id')
 
  async updateTransaction(
    @Param('id') id: string,
    @Body() updateDTO: updateTransactionDTO,
   
  ) {
    try {
      const oneData = await this.transactionService.getOneTrans(id);
      if (!oneData) {
        throw new NotFoundException('Transaction not found');
      }
      const update = await this.transactionService.updateTrans(id, updateDTO);
      return update;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('/user/:userId')
  async getUserTransactions(@Param('userId') userId: string): Promise<Transactions[]> {
    return this.transactionService.getUserTransactions(userId);
  }

  @Get('/export/:userId')
  async exportUserTransactionsToCSV(@Param('userId') userId: string): Promise<string> {
    return this.transactionService.exportUserTransactionsToCSV(userId);
  }
}
