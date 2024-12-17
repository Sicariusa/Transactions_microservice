import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from '../../src/transactions/services/transactions.service';
import { Repository } from 'typeorm';
import { Transactions } from '../../src/transactions/schema/TransactionsSchema';
import { EventEmitter2 } from 'eventemitter2';
import * as amqp from 'amqplib';
import { CreateTransactionsDTO } from '../../src/transactions/dto/createTransactions.dto';
import { mockTransactionsRepository } from 'tests/mocks/transactions.repository';

const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
};

const mockEventEmitter = new EventEmitter2();

describe('TransactionsService', () => {
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: Repository, useValue: mockRepository }, // Ensure Repository is mocked here
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should throw error if AMQP fails during token validation', async () => {
    jest.spyOn(amqp, 'connect').mockRejectedValueOnce(new Error('Connection failed'));
    await expect(service.validateToken('token123')).rejects.toThrow(Error);
  });

  it('should validate token successfully', async () => {
    jest.spyOn(amqp, 'connect').mockResolvedValue({
      createChannel: jest.fn().mockResolvedValue({
        assertQueue: jest.fn(),
        sendToQueue: jest.fn(),
      }),
    } as any);

    const response = await service.validateToken('token123');
    expect(response).toBeDefined();
  });

  it('should handle DB failure during transaction addition', async () => {
    const transactionDto: CreateTransactionsDTO = {
      amount: 100,
      vendorName: 'Amazon',
      transactionDate: new Date(),
      paymentMethod: 'credit_card',
    };

    mockRepository.save.mockRejectedValueOnce(new Error('DB error'));

    await expect(service.addTransaction(transactionDto, 'userId123')).rejects.toThrow(Error);
  });

  it('should delete a transaction and handle DB failure', async () => {
    mockRepository.findOne.mockResolvedValue({ id: '1' });
    mockRepository.delete.mockRejectedValueOnce(new Error('DB error'));

    await expect(service.deleteTrans('1', 'userId123')).rejects.toThrow(Error);
  });
});