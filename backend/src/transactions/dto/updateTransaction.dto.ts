import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class updateTransactionDTO {

    // @IsUUID()
    // @IsNotEmpty()
    // id: string;
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