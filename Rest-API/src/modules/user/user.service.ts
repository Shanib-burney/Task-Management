import { UserRepository } from "./user.repository";
import { User } from "../../generated/prisma/client";
import { CreateUserDTO, UpdateUserDTO } from "./user.validators";
import bcrypt from "bcryptjs";
import { UserRoles, UserStatus } from "./user.enum";
import { ConflictException, NotFoundException } from "../shared/utils/exceptions";
import { UserResponseDTO, UserWithoutPassword } from "./user.types";
import { getTakeSkip, PaginatedResponse, pagingDTO } from "../shared/utils/utils";

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async getAllUsers(page?: pagingDTO):Promise<PaginatedResponse<UserResponseDTO>> {
   
    
   let options = getTakeSkip(page);

    const result = await this.userRepository.findMany(options);

    return {
      rows: result.rows.map((user) => ({
        ...user,
        role: user.role !== undefined ? UserRoles[user.role] : "",
        status: user.status !== undefined ? UserStatus[user.status] : "",
      })),
      total: result.total
    }
  }
  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }


  async getUserById(id: number): Promise<UserResponseDTO | null> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return {
      ...user,
      role: user.role ? UserRoles[user.role] : "",
      status: user.status ? UserStatus[user.status] : "",
    }

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
    if (!existingUser) {
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