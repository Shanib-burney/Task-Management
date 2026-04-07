import { PaginatedResponse } from "../shared/utils/utils";
import { prisma } from "../../db/prisma-client";
import { Project } from "@prisma-client";
import { BaseRepository } from "../shared/utils/base-repository";
import { ProjectCreateInput, ProjectFindManyArgs } from "@prisma-client/models";

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
    return prisma.project.findUnique({ where: { id }, include: { tasks: true } });
  }

  async create(data:ProjectCreateInput): Promise<Project> {
    return prisma.project.create({ data });
  }

  async update(id: number, data: Partial<Omit<Project, "id">>): Promise<Project> {
    return prisma.project.update({ where: { id }, data });
  }

  async delete(id: number): Promise<Project> {
    return prisma.project.delete({ where: { id } });
  }
}
// async function createProjectWithTasks() {
//   const newProject = await prisma.project.create({
//     data: {
//       name: "GraphQL API Overhaul",
//       status: 1, // e.g., 1 = "In Progress"
//       teamId: 1, // Links to an existing Team
//       ownerId: 1, // Links to an existing User
      
//       // Here is the nested write magic:
//       tasks: {
//         create: [
//           { 
//             title: "Define Prisma schema", 
//             status: 1,
//             description: "Update the schema with new relations." 
//           },
//           { 
//             title: "Setup Apollo Server", 
//             status: 1 
//           }
//         ]
//       }
//     },
//     // This tells Prisma to fetch and return the newly created tasks along with the project
//     include: {
//       tasks: true 
//     }
//   });

//   console.log("Created Project with Tasks:", newProject);
// }