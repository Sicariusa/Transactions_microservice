import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class updateTransactionDTO {

    @IsUUID()
    id: string;
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