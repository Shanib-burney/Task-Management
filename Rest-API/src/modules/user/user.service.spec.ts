import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { User } from '@prisma-client';
import { CreateUserDTO, UpdateUserDTO } from './user.validators';
import { UserRoles, UserStatus } from './user.enum';
import { ConflictException, NotFoundException } from '../shared/utils/exceptions';
import { UserWithoutPassword } from './user.types';
import { PaginatedResponse } from '../shared/utils/utils';
import bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      findMany: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    userService = new UserService(mockUserRepository);
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return paginated users with role and status labels', async () => {
      const mockUsers: UserWithoutPassword[] = [
        {
          id: 1,
          name: 'John',
          email: 'john@example.com',
          role: 1,
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      const mockPaginatedResult: PaginatedResponse<UserWithoutPassword> = {
        rows: mockUsers,
        total: 1,
      };

      mockUserRepository.findMany.mockResolvedValue(mockPaginatedResult);

      const result = await userService.getAllUsers({ page: 1, size: 10, paging: true });

      expect(mockUserRepository.findMany).toHaveBeenCalledWith({ take: 10, skip: 0 });
      expect(result).toEqual({
        rows: [
          {
            ...mockUsers[0],
            role: 'USER',
            status: 'ACTIVE',
          },
        ],
        total: 1,
      });
    });

    it('should handle undefined role and status', async () => {
      const mockUsers: UserWithoutPassword[] = [
        {
          id: 1,
          name: 'John',
          email: 'john@example.com',
          role: 0,
          status: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      const mockPaginatedResult: PaginatedResponse<UserWithoutPassword> = {
        rows: mockUsers,
        total: 1,
      };

      mockUserRepository.findMany.mockResolvedValue(mockPaginatedResult);

      const result = await userService.getAllUsers();

      expect(result.rows[0].role).toBe('ADMIN');
      expect(result.rows[0].status).toBe('PENDING');
    });
  });

  describe('getUserById', () => {
    it('should return user with role and status labels', async () => {
      const mockUser = {
        id: 1,
        name: 'John',
        email: 'john@example.com',
        role: 1,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findById.mockResolvedValue(mockUser);

      const result = await userService.getUserById(1);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        ...mockUser,
        role: 'USER',
        status: 'ACTIVE',
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(userService.getUserById(1)).rejects.toThrow(NotFoundException);
      await expect(userService.getUserById(1)).rejects.toThrow('User with id 1 not found');
    });
  });

  describe('createUser', () => {
    const createUserData: CreateUserDTO = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: UserRoles.USER,
      status: UserStatus.ACTIVE,
    };

    it('should create user successfully', async () => {
      const hashedPassword = 'hashedPassword';
      const mockCreatedUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 1,
        status: 1,
        passwordHash: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockUserRepository.create.mockResolvedValue(mockCreatedUser);

      const result = await userService.createUser(createUserData);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('john@example.com');
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        role: 1,
        status: 1,
        passwordHash: hashedPassword,
      });
      expect(result).toBe(mockCreatedUser);
    });

    it('should throw ConflictException if email already exists', async () => {
      const existingUser = {
        id: 1,
        name: 'Existing',
        email: 'john@example.com',
        role: 1,
        status: 1,
        passwordHash: 'hash',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(userService.createUser(createUserData)).rejects.toThrow(ConflictException);
      await expect(userService.createUser(createUserData)).rejects.toThrow(
        'User with Email john@example.com already exists',
      );
    });

    it('should use default role and status if not provided', async () => {
      const dataWithoutRoleStatus = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      mockUserRepository.create.mockResolvedValue({} as User);

      await userService.createUser(dataWithoutRoleStatus as CreateUserDTO);

      expect(mockUserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          role: UserRoles.USER,
          status: UserStatus.ACTIVE,
        }),
      );
    });
  });

  describe('updateUser', () => {
    const updateData: UpdateUserDTO = {
      name: 'Updated Name',
      email: 'updated@example.com',
    };

    it('should update user successfully', async () => {
      const existingUser: UserWithoutPassword = {
        id: 1,
        name: 'Old Name',
        email: 'old@example.com',
        role: 1,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const updatedUser: User = {
        ...existingUser,
        name: 'Updated Name',
        email: 'updated@example.com',
        passwordHash: 'hash',
      };

      mockUserRepository.findById.mockResolvedValue(existingUser);
      mockUserRepository.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHash');
      mockUserRepository.update.mockResolvedValue(updatedUser);

      const result = await userService.updateUser(1, updateData);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(1);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('updated@example.com', 1);
      expect(result).toBe(updatedUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(userService.updateUser(1, updateData)).rejects.toThrow(NotFoundException);
      await expect(userService.updateUser(1, updateData)).rejects.toThrow(
        'User with id 1 not found',
      );
    });

    it('should throw ConflictException if email already exists', async () => {
      const existingUser = {
        id: 1,
        name: 'John',
        email: 'john@example.com',
        role: 1,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const conflictingUser = {
        id: 2,
        name: 'Jane',
        email: 'updated@example.com',
        role: 1,
        status: 1,
        passwordHash: 'hash',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findById.mockResolvedValue(existingUser);
      mockUserRepository.findByEmail.mockResolvedValue(conflictingUser);

      await expect(userService.updateUser(1, updateData)).rejects.toThrow(ConflictException);
      await expect(userService.updateUser(1, updateData)).rejects.toThrow(
        'User with Email updated@example.com already exists',
      );
    });

    it('should hash password if provided', async () => {
      const existingUser = {
        id: 1,
        name: 'John',
        email: 'john@example.com',
        role: 1,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const updateWithPassword = { ...updateData, password: 'newpassword' };

      mockUserRepository.findById.mockResolvedValue(existingUser);
      mockUserRepository.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHash');
      mockUserRepository.update.mockResolvedValue({} as User);

      await userService.updateUser(1, updateWithPassword);

      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
      expect(mockUserRepository.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          passwordHash: 'newHash',
        }),
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const mockDeletedUser = {
        id: 1,
        name: 'John',
        email: 'john@example.com',
        role: 1,
        status: 1,
        passwordHash: 'hash',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.delete.mockResolvedValue(mockDeletedUser);

      const result = await userService.deleteUser(1);

      expect(mockUserRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toBe(mockDeletedUser);
    });
  });
});
