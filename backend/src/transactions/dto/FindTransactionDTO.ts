import { IsUUID } from 'class-validator';

export class FindTransactionDTO {
  @IsUUID()
  id: string;
  
}