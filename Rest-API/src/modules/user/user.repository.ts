import { prisma } from "../../db/prisma-client";
import { User } from "../../generated/prisma/client";
import { UserFindManyArgs } from "../../generated/prisma/models";
import { BaseRepository } from "../shared/utils/base-repository";
import { PaginatedResponse } from "../shared/utils/utils";
import { UserWithoutPassword } from "./user.types";
import { PaginationOptions } from "./user.types";

export class UserRepository extends BaseRepository {
  async findMany(options?: { take: number; skip: number } ): Promise<PaginatedResponse<UserWithoutPassword>> {

    let userOptions: UserFindManyArgs = {
      omit: { passwordHash: true }
    }
    userOptions = {
      ...userOptions,
      take: options?.take,
      skip: options?.skip
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany(userOptions),
      prisma.user.count()
    ]);


    return {
      rows: users,
      total,
    };

  }

  async findById(id: number): Promise<UserWithoutPassword | null> {
    return prisma.user.findUnique({ where: { id }, omit: { passwordHash: true } });
  }

  async findByEmail(email: string, ignoreId?: number): Promise<User | null> {
    if (ignoreId) {
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