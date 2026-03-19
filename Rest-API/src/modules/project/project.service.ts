import { Project } from "../../generated/prisma/client";
import { ProjectRepository } from "./project.repository.js";

export class ProjectService {
  private projectRepository: ProjectRepository;

  constructor(projectRepository: ProjectRepository) {
    this.projectRepository = projectRepository;
  }

  async getAllProjects(): Promise<Project[]> {
    return this.projectRepository.findMany();
  }

  async getProjectById(id: number): Promise<Project | null> {
    return this.projectRepository.findUnique(id);
  }

  async createProject(data: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<Project> {
    return this.projectRepository.create(data);
  }

  async updateProject(id: number, data: Partial<Omit<Project, "id">>): Promise<Project> {
    return this.projectRepository.update(id, data);
  }

  async deleteProject(id: number): Promise<Project> {
    return this.projectRepository.delete(id);
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