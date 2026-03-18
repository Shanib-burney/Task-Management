import { prisma } from "../../db/prisma-client";
import { Project } from "../../generated/prisma/client";

export class ProjectRepository {
  async findMany(): Promise<Project[]> {
    return prisma.project.findMany({ include: { owner: true, team: true } });
  }

  async findUnique(id: number): Promise<Project | null> {
    return prisma.project.findUnique({ where: { id }, include: { owner: true, team: true } });
  }

  async create(data: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<Project> {
    return prisma.project.create({ data });
  }

  async update(id: number, data: Partial<Omit<Project, "id">>): Promise<Project> {
    return prisma.project.update({ where: { id }, data });
  }

  async delete(id: number): Promise<Project> {
    return prisma.project.delete({ where: { id } });
  }
}
