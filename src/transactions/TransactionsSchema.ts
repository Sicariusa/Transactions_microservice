import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
//   import { User } from './user.entity';
  
  @Entity({ schema: 'public', name: 'transactions' }) // Map to the "transactions" table
  export class Transaction {
    @PrimaryGeneratedColumn('uuid') // Automatically generates a UUID for the transaction
    id: string;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 }) // Amount with two decimal places
    amount: number;
  
    @Column({ nullable: false }) // Name of the vendor or payee
    vendorName: string;
  
    @Column({ type: 'timestamp', nullable: false }) // Timestamp of the transaction
    transactionDate: Date;
  
    @Column({ nullable: true }) // Category for the transaction
    category?: string;
  
    @Column({ type: 'enum', enum: ['cash', 'credit_card', 'debit_card', 'other'], default: 'other' }) // Payment method
    paymentMethod: 'cash' | 'credit_card' | 'debit_card' | 'other';
  
    @Column({ nullable: true }) // If card payment, store the last 4 digits
    cardLastFourDigits?: string;
  
    @Column({ type: 'text', nullable: true }) // Place or location of the transaction
    place?: string;
  
    @Column({ nullable: true, default: null }) // Notes for additional details
    notes?: string;
  
    // @ManyToOne(() => User, (user) => user.transactions, { onDelete: 'CASCADE' }) // Relationship with User entity
    // user: User;
  
    @CreateDateColumn() // Automatically records creation timestamp
    createdAt: Date;
  
    @UpdateDateColumn() // Automatically updates on modification
    updatedAt: Date;
  }