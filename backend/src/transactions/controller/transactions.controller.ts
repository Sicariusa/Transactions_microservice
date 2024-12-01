import { BadRequestException, Body, Controller, Delete, Get, Logger, NotFoundException, Param, Post, Put, Req, UnauthorizedException, UsePipes, ValidationPipe } from "@nestjs/common";
import { TransactionsService } from "../services/transactions.service";
import { CreateTransactionsDTO } from "../dto/createTransactions.dto";
import { Transactions } from "../TransactionsSchema";
import { Request } from "express";
import { updateTransactionDTO } from "../dto/updateTransaction.dto";
import { FindTransactionDTO } from "../dto/FindTransactionDTO";

@Controller('transactions')
export class TransactionsController {
  protected  readonly logger: Logger
  constructor(private readonly transactionService: TransactionsService) {}
  
  @Post('/create')
  async createTransaction(@Body() createDto: CreateTransactionsDTO): Promise<Transactions> {
    return this.transactionService.addTrans(createDto);
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

  @Delete('/deleteAll')
  async deleteAllTransactions( id: string ,@Req() req: Request): Promise<{ message: string }> {
    // const user = req.user.sub
    // if (user !== id){
    //   throw new UnauthorizedException('You can only delete your data')
    // }
    try {
      
      await this.transactionService.deleteAllTrans();
      return { message: 'All Transactions Deleted' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put('/update/:id')
  // @UsePipes(new ValidationPipe({ transform: true }))
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

  @Delete('/delete-all')
  async deleteAllTrans() {
    try {
      await this.transactionService.deleteAllTrans();
      return { message: 'All Transactions Deleted' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
