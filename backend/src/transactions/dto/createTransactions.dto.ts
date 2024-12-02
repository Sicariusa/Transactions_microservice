import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateTransactionsDTO {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(999999.99)
  amount: number;

  @IsNotEmpty()
  @IsString()
  vendorName: string;

  @IsNotEmpty()
  transactionDate: Date;

  @IsOptional()
  @IsString()
  category?: string;

  @IsEnum(['cash', 'credit_card', 'debit_card', 'other'])
  paymentMethod: 'cash' | 'credit_card' | 'debit_card' | 'other';

  @IsOptional()
  @IsString()
  cardLastFourDigits?: string;

  @IsOptional()
  @IsString()
  place?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateTransactionDto {
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(999999.99)
  amount?: number;

  @IsOptional()
  @IsString()
  vendorName?: string;

  @IsOptional()
  transactionDate?: Date;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum(['cash', 'credit_card', 'debit_card', 'other'])
  paymentMethod?: 'cash' | 'credit_card' | 'debit_card' | 'other';

  @IsOptional()
  @IsString()
  cardLastFourDigits?: string;

  @IsOptional()
  @IsString()
  place?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}