import { prisma } from "../../db/prisma-client";
import { User } from "../../generated/prisma/client";

export class UserRepository {
  async findMany(): Promise<User[]> {
    return prisma.user.findMany();
  }

  async findUnique(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
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