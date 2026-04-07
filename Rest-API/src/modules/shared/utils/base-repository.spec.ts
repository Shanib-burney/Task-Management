import { BaseRepository } from './base-repository';
import { prisma } from '../../../db/prisma-client';

class TestRepository extends BaseRepository {}

describe('BaseRepository', () => {
  let repository: TestRepository;

  beforeEach(() => {
    repository = new TestRepository();
    jest.clearAllMocks();
  });

  describe('runInTransaction', () => {
    it('should execute callback within a transaction', async () => {
      const mockCallback = jest.fn().mockResolvedValue('result');
      const mockTx = {} as any;

      (prisma.$transaction as jest.Mock).mockImplementation(async (callback) => {
        return callback(mockTx);
      });

      const result = await repository.runInTransaction(mockCallback);

      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith(mockTx);
      expect(result).toBe('result');
    });

    it('should propagate errors from callback', async () => {
      const error = new Error('Transaction failed');
      const mockCallback = jest.fn().mockRejectedValue(error);

      (prisma.$transaction as jest.Mock).mockImplementation(async (callback) => {
        return callback({} as any);
      });

      await expect(repository.runInTransaction(mockCallback)).rejects.toThrow('Transaction failed');
    });
  });
});