import { TransactionsService } from "../services/transactions.service";
import { CreateTransactionsDTO } from "../dto/createTransactions.dto";
import { Transactions } from "../TransactionsSchema";
import { Request } from "express";
import { updateTransactionDTO } from "../dto/updateTransaction.dto";
export declare class TransactionsController {
    private readonly transactionService;
    constructor(transactionService: TransactionsService);
    createTransaction(createDto: CreateTransactionsDTO): Promise<Transactions>;
    getAllTransactions(req: Request): Promise<Transactions[]>;
    getOneTransaction(id: string): Promise<Transactions[]>;
    deleteTransaction(id: string, req: Request): Promise<{
        message: string;
    }>;
    deleteAllTransactions(id: string, req: Request): Promise<{
        message: string;
    }>;
    updateTransaction(id: string, updateDTO: updateTransactionDTO): Promise<Transactions>;
}
