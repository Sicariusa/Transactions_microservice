import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
// import { UserModule } from './user/user.module';
// import { AuthModule } from './auth/auth.module';

import * as dotenv from 'dotenv';
import { TransactionsModule } from './transactions/transactions.module';
import { Transactions } from './transactions/TransactionsSchema';

dotenv.config(); // Load .env file

@Module({
  imports: [
    ConfigModule.forRoot(), // This will load environment variables from .env file
    TypeOrmModule.forRoot({
      type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5433', 10),
            username: process.env.DB_USERNAME || 'postgres',
            password: process.env.DB_PASSWORD || 'password',
            database: process.env.DB_DATABASE || 'auth_service',
            schema: 'public', // Adjust if using a different schema
            entities: [Transactions], // Register entities
            synchronize: true, // Use true for development, false for production
            logging: false, // Enable logging if needed
    }),
    //UserModule,
    //AuthModule,
    TransactionsModule,
  ],
})
export class AppModule {}
