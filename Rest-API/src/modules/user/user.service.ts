import { UserRepository } from "./user.repository";
import { User } from "../../generated/prisma/client";
import { CreateUserBody } from "./user.validators";

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findMany();
  
  }

  async getUserById(id: number): Promise<User | null> {
    return this.userRepository.findUnique(id);
  }

  async createUser(data: CreateUserBody): Promise<User> {
    // Add any business logic/validation here before calling the repository

    const userData  = {
      ...data,
      status: data.status ? data.status : 1,
      passwordHash: data.password, // In a real app, hash the password before storing
    };
    return this.userRepository.create(userData);

  }

  async updateUser(id: number, data: Partial<Omit<User, "id">>): Promise<User> {
    // Add any business logic/validation here
    return this.userRepository.update(id, data);
  }

  async deleteUser(id: number): Promise<User> {
    // Add any business logic/validation here
    return this.userRepository.delete(id);
  }
}