import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
// import { UserModule } from './user/user.module';
// import { AuthModule } from './auth/auth.module';

import * as dotenv from 'dotenv';

import { Transactions } from './transactions/TransactionsSchema';
import { HttpModule } from '@nestjs/axios';
import { TransactionsModule } from './transactions/modules/transactions.module';
import * as Joi from 'joi';

dotenv.config(); // Load .env file

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigModule available globally
      envFilePath: '.env', // Specify the path to the .env file
    }), // This will load environment variables from .env file
    TypeOrmModule.forRoot({
        type: 'postgres',
        
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        ssl: {
            rejectUnauthorized: false,
        },
        entities: [Transactions],
        synchronize: true,
        retryAttempts: 5,
        retryDelay: 3000,
        connectTimeoutMS: 10000,
    }),
    TypeOrmModule.forFeature([Transactions]),
    //UserModule,
    //AuthModule,
    TransactionsModule,
    HttpModule,
  ],
 
})
export class AppModule {}
