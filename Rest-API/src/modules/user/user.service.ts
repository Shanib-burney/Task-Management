import { UserRepository } from "./user.repository";
import { User } from "../../generated/prisma/client";

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

  async createUser(data: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    // Add any business logic/validation here before calling the repository
    return this.userRepository.create(data);
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