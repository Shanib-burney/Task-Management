import { UserRepository } from "./user.repository";
import { User } from "../../generated/prisma/client";
import { CreateUserDTO, UpdateUserDTO } from "./user.validators";
import bcrypt from "bcryptjs";
import { UserRoles, UserStatus } from "./user.enum";
import { ConflictException, NotFoundException } from "../shared/utils/exceptions";

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findMany();

  }
  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }


  async getUserById(id: number): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async createUser(data: CreateUserDTO): Promise<User> {

    const userByEmail = await this.userRepository.findByEmail(data.email);
    if (userByEmail) {
      throw new ConflictException(`User with Email ${data.email} already exists`)
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const { password, ...remainingData } = data;

    const userData = {
      ...remainingData,
      role: data.role ? Number(data.role) : UserRoles.USER,
      status: data.status ?? UserStatus.ACTIVE,
      passwordHash: hashedPassword
    };
    return this.userRepository.create(userData);

  }

  async updateUser(id: number, data: UpdateUserDTO): Promise<User> {
    // Add any business logic/validation here
    const existingUser = await this.userRepository.findById(id);
    if(!existingUser){
      throw new NotFoundException(`User with id ${id} not found`)
    }
    
    if (data.email) {
      const existingUserEmail = await this.userRepository.findByEmail(data.email, id);
      if (existingUserEmail) {
        throw new ConflictException(`User with Email ${data.email} already exists`);
      }
    }
    return this.userRepository.update(id, {
      name: data.name ?? undefined,
      email: data.email ?? undefined,
      role: data.role !== undefined ? Number(data.role) : undefined,
      status: data.status !== undefined ? Number(data.status) : undefined,
      passwordHash: data.password !== undefined ? await bcrypt.hash(data.password, 10) : undefined,
    });
  }

  async deleteUser(id: number): Promise<User> {
    // Add any business logic/validation here
    return this.userRepository.delete(id);
  }
}