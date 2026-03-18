import { prisma } from "../../db/prisma-client";
import { Team } from "../../generated/prisma/client";


export class TeamRepository {
  async findMany(): Promise<Team[]> {
    return prisma.team.findMany();
  }

  async findUnique(id: number): Promise<Team | null> {
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