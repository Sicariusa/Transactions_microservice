import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { TransactionService } from "../services/transactions.service";
import { CreateTransactionsDTO } from "../dto/createTransactions.dto";
import { Transaction } from "../TransactionsSchema";

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async createTransaction(@Body() createDto: CreateTransactionsDTO): Promise<Transaction> {
    // Validate userId with User service (via HTTP call or event)
    const isValidUser = await this.validateUser(createDto.userId);
    if (!isValidUser) {
      throw new BadRequestException('Invalid user ID');
    }

    return this.transactionService.create(createDto);
  }

  private async validateUser(userId: string): Promise<boolean> {
    // Call the User service's API (e.g., via HTTP or message broker)
    return true; // Replace with actual implementation
  }
}
