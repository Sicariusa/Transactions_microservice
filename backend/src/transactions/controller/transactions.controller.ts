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
  Headers, 
  UnauthorizedException 
} from "@nestjs/common";
import { TransactionsService } from "../services/transactions.service";
import { CreateTransactionsDTO } from "../dto/createTransactions.dto";
import { Transactions } from "../TransactionsSchema";
import { updateTransactionDTO } from "../dto/updateTransaction.dto";

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionService: TransactionsService,
  ) {}

  /**
   * Create a Transaction
   */
  @Post('/create')
  async createTransaction(
    @Body() createDto: CreateTransactionsDTO,
    @Headers('Authorization') authorization: string,
  ): Promise<Transactions> {
    if (!authorization) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    // Extract and validate token
    const token = authorization.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Invalid Authorization header format');
    }

    // Call the service to handle transaction creation
    return this.transactionService.createTransaction(createDto, token);
  }

  /**
   * Get All Transactions for the User
   */
  @Get()
  async getAllTransactions(@Headers('Authorization') authorization: string): Promise<Transactions[]> {
    const token = this.extractToken(authorization);
    const userId = await this.transactionService.validateToken(token);
    return this.transactionService.getAllTrans(userId);
  }

  /**
   * Get One Transaction for the User
   */
  @Get('/:id')
  async getOneTransaction(
    @Param('id') id: string,
    @Headers('Authorization') authorization: string,
  ): Promise<Transactions> {
    const token = this.extractToken(authorization);
    const userId = await this.transactionService.validateToken(token);
    return this.transactionService.getOneTrans(id, userId);
  }

  /**
   * Delete One Transaction for the User
   */
  @Delete('/delete/:id')
  async deleteTransaction(
    @Param('id') id: string,
    @Headers('Authorization') authorization: string,
  ): Promise<{ message: string }> {
    const token = this.extractToken(authorization);
    const userId = await this.transactionService.validateToken(token);
    await this.transactionService.deleteTrans(id, userId);
    return { message: 'Transaction deleted successfully' };
  }

  /**
   * Delete All Transactions for the User
   */
  @Delete('/deleteAll')
  async deleteAllTransactions(@Headers('Authorization') authorization: string): Promise<{ message: string }> {
    const token = this.extractToken(authorization);
    const userId = await this.transactionService.validateToken(token);
    await this.transactionService.deleteAllTrans(userId);
    return { message: 'All transactions deleted successfully' };
  }

  /**
   * Update a Transaction for the User
   */
  @Put('/update/:id')
  async updateTransaction(
    @Param('id') id: string,
    @Body() updateDto: updateTransactionDTO,
    @Headers('Authorization') authorization: string,
  ): Promise<Transactions> {
    const token = this.extractToken(authorization);
    const userId = await this.transactionService.validateToken(token);
    return this.transactionService.updateTrans(id, updateDto, userId);
  }

  /**
   * Extract Token Helper
   */
  private extractToken(authorization: string): string {
    if (!authorization) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    const token = authorization.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Invalid Authorization header format');
    }
    return token;
  }
}
