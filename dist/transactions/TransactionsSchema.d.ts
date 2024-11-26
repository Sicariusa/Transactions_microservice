export declare class Transactions {
    id: string;
    amount: number;
    vendorName: string;
    transactionDate: Date;
    category?: string;
    paymentMethod: 'cash' | 'credit_card' | 'debit_card' | 'other';
    cardLastFourDigits?: string;
    place?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
