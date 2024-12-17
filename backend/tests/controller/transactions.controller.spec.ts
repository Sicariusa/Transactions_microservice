import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from '../../src/transactions/controller/transactions.controller';
import { TransactionsService } from '../../src/transactions/services/transactions.service';
import { UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { CreateTransactionsDTO } from '../../src/transactions/dto/createTransactions.dto';

const mockService = {
  validateToken: jest.fn(),
  addTransaction: jest.fn(),
  deleteTrans: jest.fn(),
  getOneTrans: jest.fn(), // Mocked missing method
};

describe('TransactionsController', () => {
  let controller: TransactionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should create a transaction', async () => {
    const createDto: CreateTransactionsDTO = {
      amount: 100,
      vendorName: 'Amazon',
      transactionDate: new Date(),
      paymentMethod: 'credit_card',
    };

    const reqMock = { headers: { authorization: 'Bearer token' } };

    mockService.validateToken.mockResolvedValue({ isValid: true, userId: '123' });
    mockService.addTransaction.mockResolvedValue({ id: '1', ...createDto });

    const response = await controller.createTransaction(createDto, reqMock as Request);

    expect(response).toEqual({ id: '1', ...createDto });
    expect(mockService.validateToken).toHaveBeenCalledWith('token');
    expect(mockService.addTransaction).toHaveBeenCalledWith(createDto, '123');
  });

  it('should throw UnauthorizedException if token is invalid', async () => {
    const createDto: CreateTransactionsDTO = {
      amount: 100,
      vendorName: 'Amazon',
      transactionDate: new Date(),
      paymentMethod: 'credit_card',
    };

    const reqMock = { headers: { authorization: 'Bearer token' } };

    mockService.validateToken.mockRejectedValueOnce(new UnauthorizedException());

    await expect(controller.createTransaction(createDto, reqMock as Request))
      .rejects
      .toThrow(UnauthorizedException);

    expect(mockService.validateToken).toHaveBeenCalledWith('token');
  });

  it('should handle invalid payloads with BadRequestException', async () => {
    const createDto = {}; // Invalid payload
    const reqMock = { headers: { authorization: 'Bearer token' } };

    mockService.validateToken.mockResolvedValue({ isValid: true, userId: '123' });

    await expect(controller.createTransaction(createDto as any, reqMock as Request))
      .rejects
      .toThrow(BadRequestException);

    expect(mockService.validateToken).toHaveBeenCalled();
  });

  it('should delete a transaction', async () => {
    const reqMock = { headers: { authorization: 'Bearer token' } };

    mockService.validateToken.mockResolvedValue({ isValid: true, userId: '123' });
    mockService.deleteTrans.mockResolvedValue({ id: '1' });

    const response = await controller.deleteTransaction('some-id', reqMock as Request);

    expect(response).toEqual({ message: 'Transaction deleted' });
    expect(mockService.validateToken).toHaveBeenCalled();
    expect(mockService.deleteTrans).toHaveBeenCalled();
  });

  it('should throw UnauthorizedException if token validation fails on delete', async () => {
    const reqMock = { headers: { authorization: 'Bearer token' } };

    mockService.validateToken.mockRejectedValueOnce(new UnauthorizedException());

    await expect(controller.deleteTransaction('some-id', reqMock as Request))
      .rejects
      .toThrow(UnauthorizedException);

    expect(mockService.validateToken).toHaveBeenCalled();
  });
});