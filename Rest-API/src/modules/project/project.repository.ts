import { PaginatedResponse } from "modules/shared/utils/utils";
import { prisma } from "../../db/prisma-client";
import { Project } from "@prisma-client";
import { BaseRepository } from "../shared/utils/base-repository";
import { ProjectFindManyArgs } from "generated/prisma/models";

export class ProjectRepository extends BaseRepository {
  async findMany(options?: { take: number; skip: number }): Promise<PaginatedResponse<Project>> {


        let projectOptions: ProjectFindManyArgs ={}
        projectOptions = {
          ...projectOptions,
          take: options?.take,
          skip: options?.skip
        }
    
        const [project, total] = await Promise.all([
          prisma.project.findMany(projectOptions),
          prisma.project.count()
        ]);
    
    
        return {
          rows: project,
          total,
        };
    
  }

  async findById(id: number): Promise<Project | null> {
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
