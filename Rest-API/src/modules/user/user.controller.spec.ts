import { Request, Response } from 'express';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDTO, UpdateUserDTO } from './user.validators';
import { BadRequestException, NotFoundException } from '../shared/utils/exceptions';
import HTTP_STATUS_CODE from '../shared/utils/http-status-code';
import { pagingDTO } from '../shared/utils/utils';

describe('UserController', () => {
  let userController: UserController;
  let mockUserService: jest.Mocked<UserService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockUserService = {
      getAllUsers: jest.fn(),
      getUserById: jest.fn(),
      getUserByEmail: jest.fn(),
      createUser: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
    } as any;

    userController = new UserController(mockUserService);

    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      locals: {},
    };
    mockNext = jest.fn();

    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return users successfully', async () => {
      const mockUsers = { rows: [], total: 0 };
      const mockValidatedQuery: pagingDTO = { page: 1, size: 10 };

      mockUserService.getAllUsers.mockResolvedValue(mockUsers);
      mockResponse.locals = { validatedQuery: mockValidatedQuery };

      await userController.getAllUsers(mockRequest as Request, mockResponse as any);

      expect(mockUserService.getAllUsers).toHaveBeenCalledWith(mockValidatedQuery);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should throw error if service throws', async () => {
      const error = new Error('Service error');
      mockUserService.getAllUsers.mockRejectedValue(error);
      mockResponse.locals = { validatedQuery: {} };

      await expect(userController.getAllUsers(mockRequest as Request, mockResponse as any)).rejects.toThrow(error);
    });
  });

  describe('getUserById', () => {
    it('should return user successfully', async () => {
      const mockUser = { id: 1, name: 'John', email: 'john@example.com', role: 'USER', status: 'ACTIVE', createdAt: new Date(), updatedAt: new Date() };
      mockRequest.params = { id: '1' };
      mockUserService.getUserById.mockResolvedValue(mockUser);

      await userController.getUserById(mockRequest as Request, mockResponse as Response);

      expect(mockUserService.getUserById).toHaveBeenCalledWith(1);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
    });

    it('should throw BadRequestException for invalid id', async () => {
      mockRequest.params = { id: 'invalid' };

      await expect(userController.getUserById(mockRequest as Request, mockResponse as Response)).rejects.toThrow(BadRequestException);
      await expect(userController.getUserById(mockRequest as Request, mockResponse as Response)).rejects.toThrow('Invalid user ID');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRequest.params = { id: '1' };
      mockUserService.getUserById.mockRejectedValue(new NotFoundException('User not found'));

      await expect(userController.getUserById(mockRequest as Request, mockResponse as Response)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createUser', () => {
    const createUserData: CreateUserDTO = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 0,
      status: 1,
    };

    it('should create user successfully', async () => {
      mockRequest.body = createUserData;
      mockUserService.createUser.mockResolvedValue({} as any);

      await userController.createUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockUserService.createUser).toHaveBeenCalledWith(createUserData);
      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User created successfully' });
    });

    it('should call next with error if service throws', async () => {
      const error = new Error('Creation failed');
      mockRequest.body = createUserData;
      mockUserService.createUser.mockRejectedValue(error);

      await userController.createUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('patchUser', () => {
    const updateUserData: UpdateUserDTO = {
      name: 'Updated Name',
    };

    it('should update user successfully', async () => {
      const mockReq = mockRequest as Request<{ id: string }, {}, UpdateUserDTO>;
      mockReq.params = { id: '1' };
      mockReq.body = updateUserData;
      mockUserService.updateUser.mockResolvedValue({} as any);

      await userController.patchUser(mockReq, mockResponse as Response);

      expect(mockUserService.updateUser).toHaveBeenCalledWith(1, updateUserData);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User updated successfully' });
    });

    it('should throw error if service throws', async () => {
      const error = new Error('Update failed');
      const mockReq = mockRequest as Request<{ id: string }, {}, UpdateUserDTO>;
      mockReq.params = { id: '1' };
      mockReq.body = updateUserData;
      mockUserService.updateUser.mockRejectedValue(error);

      await expect(userController.patchUser(mockReq, mockResponse as Response)).rejects.toThrow(error);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      mockRequest.params = { id: '1' };
      mockUserService.deleteUser.mockResolvedValue({} as any);

      await userController.deleteUser(mockRequest as Request, mockResponse as Response);

      expect(mockUserService.deleteUser).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should throw BadRequestException for invalid id', async () => {
      mockRequest.params = { id: 'invalid' };

      await expect(userController.deleteUser(mockRequest as Request, mockResponse as Response)).rejects.toThrow(BadRequestException);
      await expect(userController.deleteUser(mockRequest as Request, mockResponse as Response)).rejects.toThrow('Invalid user ID');
    });

    it('should throw error if service throws', async () => {
      const error = new Error('Delete failed');
      mockRequest.params = { id: '1' };
      mockUserService.deleteUser.mockRejectedValue(error);

      await expect(userController.deleteUser(mockRequest as Request, mockResponse as Response)).rejects.toThrow(error);
    });
  });
});