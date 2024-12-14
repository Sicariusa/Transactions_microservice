import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ schema: 'public', name: 'Transactions' })
export class Transactions {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: false })
    userId: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column()
    vendorName: string;

    @Column({ type: 'timestamp' })
    transactionDate: Date;

    @Column({ nullable: true })
    category?: string;

    @Column({
        type: 'enum',
        enum: ['cash', 'credit_card', 'debit_card', 'other'],
        default: 'cash'
    })
    paymentMethod: 'cash' | 'credit_card' | 'debit_card' | 'other';

    @Column({ nullable: true })
    cardLastFourDigits?: string;

    @Column({ nullable: true })
    place?: string;

    @Column({ nullable: true })
    notes?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}