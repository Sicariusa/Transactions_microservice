import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateTransactionsDTO {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  vendorName: string;

  @IsNotEmpty()
  @IsString()
  transactionDate: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsString()
  paymentMethod: string;

  @IsString()
  cardLastFourDigits?: string;

  @IsString()
  place?: string;

  @IsString()
  notes?: string;

  // userId will be set dynamically after token validation
  userId?: string;
}
