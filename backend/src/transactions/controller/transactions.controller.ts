import { BadRequestException, Body, Controller, Delete, Get, Logger, NotFoundException, Param, Post, Put, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { TransactionsService } from "../services/transactions.service";
import { Request } from "express";

import { CreateTransactionsDTO } from "../dto/createTransactions.dto";
import { updateTransactionDTO } from "../dto/updateTransaction.dto";
import { FindTransactionDTO } from "../dto/FindTransactionDTO";

import { Transactions } from "../schema/TransactionsSchema";
import { AuthGuard } from "../guards/auth.guard";
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { PATTERNS } from '../../constants';

// helper functions to generate data 

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min: number, max: number, decimalPlaces: number): number {
  const rand = Math.random() * (max - min) + min;
  return parseFloat(rand.toFixed(decimalPlaces));
}

function getRandomPaymentMethod(): 'cash' | 'credit_card' | 'debit_card' | 'other' {
  const paymentMethods: ('cash' | 'credit_card' | 'debit_card' | 'other')[] = ['cash', 'credit_card', 'debit_card', 'other'];
  return paymentMethods[getRandomInt(0, paymentMethods.length - 1)];
}

const vendorNames = [
  'Abdo4Tech',
  'HyperMart',
  'SportsHub',
  'HealthPlus',
  'Panda',
  'Electronix',
  'Uncle Bashandy'
]

const places = [
  'Fifth Settlement',
  '6th Of Ocotber',
  'Downtown',
  'Central Park',
  'Tahrir Square',
  'New Cairo',
  'City Park',
  'DreamLand'
]

const categories = ['Groceries', 'Electronics', 'Entertainment', 'Food', 'Utilities'];

function generateRandomTransaction(userId: string): CreateTransactionsDTO {

  const randomDate = new Date();
  const randomDays = getRandomInt(-365, 365); // Random days in the range of -365 days to +365 days (1 year before and after)
  randomDate.setDate(randomDate.getDate() + randomDays);

  return {
  userId,
    amount: getRandomFloat(1, 5000, 2), // Random amount between 1 and 5000 with 2 decimal places
    vendorName: vendorNames[getRandomInt(0, vendorNames.length - 1)], // Random vendor from the static list
    transactionDate: randomDate, // Random date within the last 30 days
    category: categories[getRandomInt(0, categories.length - 1)], // Random category from predefined list
    paymentMethod: getRandomPaymentMethod(),
    cardLastFourDigits: Math.random() > 0.5 ? `${getRandomInt(1000, 9999)}` : undefined, // Random card number
    place: places[getRandomInt(0, places.length - 1)], // Random place from the static list
    notes: `Transaction note ${getRandomInt(1, 1000)}`, // Random note
  };
}


@Controller('transactions')
@UseGuards(AuthGuard)
export class TransactionsController {
  private readonly logger = new Logger(TransactionsController.name);

  constructor(
    private readonly transactionService: TransactionsService,
    @Inject('ANALYSIS_SERVICE') private readonly client: ClientProxy,
  ) {}
  
  @Post('/create')
  async createTransaction(
    @Body() createDto: CreateTransactionsDTO,
    @Req() req: any
  ): Promise<Transactions> {
    const userId = req.user?.id || createDto.userId;
    const transaction = await this.transactionService.addTrans({
      ...createDto,
      userId,
    });
    // Send a message to the Analysis service
    this.client.emit('transaction_created', transaction);
    return transaction;
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
  async getUserTransactions(@Param('userId') userId: string) {
    try {
      const transactions = await this.transactionService.getUserTransactions(userId);
      
      this.logger.log(`Emitting user_transactions_fetched event for userId: ${userId}`);
      
      // Use emit instead of send for one-way communication
      await this.client.connect(); // Ensure connection is established
      
      this.client.emit('user_transactions_fetched', {
        userId,
        transactions,
        timestamp: new Date()
      });
      
      return transactions;
    } catch (error) {
      this.logger.error(`Error in getUserTransactions: ${error.message}`);
      throw error;
    }
  }
  @Get('/export/:userId')
  async exportUserTransactionsToCSV(@Param('userId') userId: string): Promise<string> {
    return this.transactionService.exportUserTransactionsToCSV(userId);
  }

  @Post('create-many')
  async createMultipleTransactions(
    @Body('userId') userId: string,
    @Body('count') count: number, // Specify how many transactions to create
  ): Promise<CreateTransactionsDTO[]> {
    const transactions: CreateTransactionsDTO[] = [];
    
    for (let i = 0; i < count; i++) {
      const transaction = generateRandomTransaction(userId); // Generate random transaction
      transactions.push(transaction);
    }

    // Assuming you have a service to handle saving these transactions
    await this.transactionService.createManyTransactions(transactions);

    return transactions; // Optionally return the generated transactions
  } 

  @Delete('delete-by-user/:userId')
  async deleteByUserId(@Param('userId') userId: string): Promise<string> {
    await this.transactionService.deleteTransactionsByUserId(userId);
    return `Transactions for user ${userId} have been deleted`;
  }
}