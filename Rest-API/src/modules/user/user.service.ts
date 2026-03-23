import { UserRepository } from "./user.repository";
import { User } from "../../generated/prisma/client";
import { CreateUserBody } from "./user.validators";
import bcrypt from "bcryptjs";
import { UserRoles, UserStatus } from "./user.enum";

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
    
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const { password, ...remainingData } = data;
    
    const userData  = {
      ...remainingData,
      role : data.role ? Number(data.role) : UserRoles.USER,
      status: data.status ?? UserStatus.ACTIVE,
      passwordHash: hashedPassword
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