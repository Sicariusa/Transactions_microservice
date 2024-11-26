import { CreateTransactionsDTO } from '../dto/createTransactions.dto';
import { Transactions } from '../TransactionsSchema';
import { Repository } from 'typeorm';
import { updateTransactionDTO } from '../dto/updateTransaction.dto';
export declare class TransactionsService {
    private readonly TransactionRepo;
    constructor(TransactionRepo: Repository<Transactions>);
    addTrans(createDto: CreateTransactionsDTO): Promise<Transactions>;
    getAllTrans(): Promise<Transactions[]>;
    getOneTrans(id: string): Promise<Transactions[]>;
    deleteTrans(id: string): Promise<import("typeorm").DeleteResult>;
    deleteAllTrans(): Promise<void>;
    updateTrans(id: string, updateDto: updateTransactionDTO): Promise<Transactions>;
}
