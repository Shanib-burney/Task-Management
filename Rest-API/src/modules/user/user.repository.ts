import { prisma } from "../../db/prisma-client";
import { User } from "../../generated/prisma/client";
import { BaseRepository } from "../shared/utils/base-repository";

export class UserRepository extends BaseRepository {
  async findMany(): Promise<User[]> {
    return prisma.user.findMany();
  }

  async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

    async findByEmail(email: string, ignoreId?: number): Promise<User | null> {
      if(ignoreId) {
        return prisma.user.findUnique({ where: { email, NOT: { id: ignoreId } } });
      } 
    return prisma.user.findUnique({ where: { email } });
  }

  async create(data: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    return prisma.user.create({ data });
  }

  async update(id: number, data: Partial<Omit<User, "id">>): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }

  async delete(id: number): Promise<User> {
    return prisma.user.delete({ where: { id } });
  }
}