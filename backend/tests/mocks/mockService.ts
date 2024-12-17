export const mockService = {
    validateToken: jest.fn().mockResolvedValue({ isValid: true, userId: '123' }),
    getOneTrans: jest.fn().mockResolvedValue({ id: '1', userId: '123' }),
    deleteTrans: jest.fn().mockResolvedValue({}),
  };  