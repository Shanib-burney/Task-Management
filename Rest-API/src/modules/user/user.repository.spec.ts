import { UserRepository } from './user.repository';
import { prisma } from '../../db/prisma-client';

describe('UserRepository', () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = new UserRepository();
    jest.clearAllMocks();
  });

  describe('findMany', () => {
    it('should return paginated users without password hash', async () => {
      const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 1, status: 1, createdAt: new Date(), updatedAt: new Date() },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com', role: 1, status: 1, createdAt: new Date(), updatedAt: new Date() },
      ];

      (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);
      (prisma.user.count as jest.Mock).mockResolvedValue(2);

      const result = await userRepository.findMany({ take: 10, skip: 0 });

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        omit: { passwordHash: true },
        take: 10,
        skip: 0,
      });
      expect(prisma.user.count).toHaveBeenCalled();
      expect(result).toEqual({
        rows: mockUsers,
        total: 2,
      });
    });

    it('should work without pagination options', async () => {
      const mockUsers: any[] = [];

      (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);
      (prisma.user.count as jest.Mock).mockResolvedValue(0);

      const result = await userRepository.findMany();

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        omit: { passwordHash: true },
      });
      expect(result).toEqual({
        rows: mockUsers,
        total: 0,
      });
    });
  });

  describe('findById', () => {
    it('should return user by id without password hash', async () => {
      const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com', role: 1, status: 1, createdAt: new Date(), updatedAt: new Date() };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await userRepository.findById(1);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        omit: { passwordHash: true },
      });
      expect(result).toBe(mockUser);
    });

    it('should return null if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await userRepository.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return user by email', async () => {
      const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com', role: 1, status: 1, passwordHash: 'hashed', createdAt: new Date(), updatedAt: new Date() };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await userRepository.findByEmail('john@example.com');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
      });
      expect(result).toBe(mockUser);
    });

    it('should exclude user with specific id when ignoreId is provided', async () => {
      const mockUser = { id: 2, name: 'Jane Doe', email: 'jane@example.com', role: 1, status: 1, passwordHash: 'hashed', createdAt: new Date(), updatedAt: new Date() };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await userRepository.findByEmail('jane@example.com', 1);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'jane@example.com', NOT: { id: 1 } },
      });
      expect(result).toBe(mockUser);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 1,
        status: 1,
        passwordHash: 'hashedPassword',
      };
      const mockCreatedUser = { id: 1, ...userData, createdAt: new Date(), updatedAt: new Date() };

      (prisma.user.create as jest.Mock).mockResolvedValue(mockCreatedUser);

      const result = await userRepository.create(userData);

      expect(prisma.user.create).toHaveBeenCalledWith({ data: userData });
      expect(result).toBe(mockCreatedUser);
    });
  });

  describe('update', () => {
    it('should update user by id', async () => {
      const updateData = { name: 'Updated Name' };
      const mockUpdatedUser = { id: 1, name: 'Updated Name', email: 'john@example.com', role: 1, status: 1, passwordHash: 'hashed', createdAt: new Date(), updatedAt: new Date() };

      (prisma.user.update as jest.Mock).mockResolvedValue(mockUpdatedUser);

      const result = await userRepository.update(1, updateData);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateData,
      });
      expect(result).toBe(mockUpdatedUser);
    });
  });

  describe('delete', () => {
    it('should delete user by id', async () => {
      const mockDeletedUser = { id: 1, name: 'John Doe', email: 'john@example.com', role: 1, status: 1, passwordHash: 'hashed', createdAt: new Date(), updatedAt: new Date() };

      (prisma.user.delete as jest.Mock).mockResolvedValue(mockDeletedUser);

      const result = await userRepository.delete(1);

      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toBe(mockDeletedUser);
    });
  });
});