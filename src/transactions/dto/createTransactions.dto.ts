import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateTransactionsDTO {
    @IsNotEmpty()
    @IsString()
    id: string;
    title: string
    type: string
    
    @IsNotEmpty()
    @IsNumber()
    amount: number

    @IsNotEmpty()
    @IsDate()
    date: Date
}