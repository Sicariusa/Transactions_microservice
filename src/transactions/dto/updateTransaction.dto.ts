import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class updateTransactionDTO {


    @IsOptional()
    @IsString()
    title?: string
    type?: string
    
    @IsOptional()
    @IsNumber()
    amount?: number

    @IsOptional()
    @IsDate()
    date?: Date
}