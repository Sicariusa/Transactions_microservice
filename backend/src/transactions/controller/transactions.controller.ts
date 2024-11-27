import { 
  BadRequestException, 
  Body, 
  Controller, 
  Delete, 
  Get, 
  NotFoundException, 
  Param, 
  Post, 
  Put, 
  Req, 
  UnauthorizedException, 
  Headers 
} from "@nestjs/common";
import { TransactionsService } from "../services/transactions.service";
import { CreateTransactionsDTO } from "../dto/createTransactions.dto";
import { Transactions } from "../TransactionsSchema";
import { Request } from "express";
import { updateTransactionDTO } from "../dto/updateTransaction.dto";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionService: TransactionsService,
    private readonly httpService: HttpService, // Inject HttpService for token validation
  ) {}

  /**
   * Helper Function to Validate Token and Get UserID
   */
  private async validateToken(token: string): Promise<string> {
    const authServiceUrl = process.env.AUTH_SERVICE_URL;

    if (!token) {
      throw new UnauthorizedException('Authorization token is missing');
    }

    const actualToken = token.replace('Bearer ', ''); // Extract Bearer token

    try {
      const response = await lastValueFrom(
        this.httpService.post(authServiceUrl, { token: actualToken })
      );
      return response.data.sub; // Assuming 'sub' is the userId
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  @Post('/create')
  async createTransaction(
    @Body() createDto: CreateTransactionsDTO,
    @Headers('Authorization') token: string
  ): Promise<Transactions> {
    // Validate token and get userId
    const userId = await this.validateToken(token);
    createDto.userId = userId; // Assign the userId to the transaction
    return this.transactionService.addTrans(createDto);
  }

  @Get()
  async getAllTransactions(
    @Headers('Authorization') token: string
  ): Promise<Transactions[]> {
    const userId = await this.validateToken(token); // Validate token and get userId
    try {
      const data = await this.transactionService.getAllTrans(userId); // Filter by userId
      if (!data || data.length === 0) {
        throw new NotFoundException('No Transactions Found');
      }
      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('/:id')
  async getOneTransaction(
    @Param('id') id: string, 
    @Headers('Authorization') token: string
  ): Promise<Transactions> {
    const userId = await this.validateToken(token); // Validate token and get userId
    try {
      const oneData = await this.transactionService.getOneTrans(id, userId); // Check if transaction belongs to user
      if (!oneData) {
        throw new NotFoundException('No transaction Found');
      }
      return oneData;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete('/delete/:id')
  async deleteTransaction(
    @Param('id') id: string, 
    @Headers('Authorization') token: string
  ): Promise<{ message: string }> {
    const userId = await this.validateToken(token); // Validate token and get userId
    try {
      const oneData = await this.transactionService.getOneTrans(id, userId); // Check if transaction belongs to user
      if (!oneData) {
        throw new NotFoundException('Transaction not found');
      }

      await this.transactionService.deleteTrans(id, userId); // Ensure only user's transaction is deleted
      return { message: 'Transaction Deleted' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete('/deleteAll')
  async deleteAllTransactions(
    @Headers('Authorization') token: string
  ): Promise<{ message: string }> {
    const userId = await this.validateToken(token); // Validate token and get userId
    try {
      await this.transactionService.deleteAllTrans(userId); // Delete all transactions for this user
      return { message: 'All Transactions Deleted' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put('/update/:id')
  async updateTransaction(
    @Param('id') id: string, 
    @Body() updateDTO: updateTransactionDTO, 
    @Headers('Authorization') token: string
  ): Promise<Transactions> {
    const userId = await this.validateToken(token); // Validate token and get userId
    try {
      const oneData = await this.transactionService.getOneTrans(id, userId); // Check if transaction belongs to user
      if (!oneData) {
        throw new NotFoundException('Transaction not found');
      }
      return this.transactionService.updateTrans(id, updateDTO, userId); // Update transaction for this user
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
