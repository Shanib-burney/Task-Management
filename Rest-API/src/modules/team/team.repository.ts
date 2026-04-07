import { PaginatedResponse } from "../shared/utils/utils";
import { prisma } from "../../db/prisma-client";
import { Team } from "@prisma-client";
import { BaseRepository } from "../shared/utils/base-repository";

export class TeamRepository extends BaseRepository {
  async findMany(options?: { take: number; skip: number }): Promise<PaginatedResponse<Team>> {
    const [teams, total] = await Promise.all([
      prisma.team.findMany(options),
      prisma.team.count()
    ]);

    return {
      rows: teams,
      total
    };
  }

  async findById(id: number): Promise<Team | null> {
    return prisma.team.findUnique({ where: { id } });
  }

  async create(data: Omit<Team, "id" | "createdAt" | "updatedAt">): Promise<Team> {
    return prisma.team.create({ data });
  }

  async update(id: number, data: Partial<Omit<Team, "id">>): Promise<Team> {
    return prisma.team.update({ where: { id }, data });
  }

  async delete(id: number): Promise<Team> {
    return prisma.team.delete({ where: { id } });
  }
}