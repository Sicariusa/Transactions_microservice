import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ schema: 'public', name: 'Transactions' }) // Map to the "transactions" table
export class Transactions {
  @PrimaryGeneratedColumn('uuid') // Automatically generates a UUID for the transaction
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 }) // Amount with two decimal places
  amount: number;

  @Column({ name: 'vendorname', nullable: false }) // Name of the vendor or payee
  vendorName: string;

  @Column({ name: 'transactiondate', type: 'timestamp', nullable: false }) // Timestamp of the transaction
  transactionDate: Date;

  @Column({ nullable: true }) // Category for the transaction
  category?: string;

  @Column({ name: 'paymentmethod', type: 'enum', enum: ['cash', 'credit_card', 'debit_card', 'other'], default: 'other' }) // Payment method
  paymentMethod: 'cash' | 'credit_card' | 'debit_card' | 'other';

  @Column({ name: 'cardlastfourdigits', nullable: true }) // If card payment, store the last 4 digits
  cardLastFourDigits?: string;

  @Column({ type: 'text', nullable: true }) // Place or location of the transaction
  place?: string;

  @Column({ nullable: true, default: null }) // Notes for additional details
  notes?: string;

  @CreateDateColumn({ name: 'createdat' }) // Automatically records creation timestamp
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedat' }) // Automatically updates on modification
  updatedAt: Date;
}