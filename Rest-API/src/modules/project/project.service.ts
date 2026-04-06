import { Project } from "../../generated/prisma/client";
import { ProjectRepository } from "./project.repository";
import { CreateProjectDTO, UpdateProjectDTO } from "./project.validators";
import { NotFoundException } from "../shared/utils/exceptions";
import { ProjectResponseDTO } from "./project.types";

export class ProjectService {
  private projectRepository: ProjectRepository;

  constructor(projectRepository: ProjectRepository) {
    this.projectRepository = projectRepository;
  }

  async getAllProjects(): Promise<ProjectResponseDTO[]> {
    return this.projectRepository.findMany();
  }

  async getProjectById(id: number): Promise<ProjectResponseDTO> {
    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }
    return project;
  }

  async createProject(data: CreateProjectDTO): Promise<ProjectResponseDTO> {
    return this.projectRepository.create({
      ...data,
      status: data.status ?? 0,
    });
  }

  async updateProject(id: number, data: UpdateProjectDTO): Promise<ProjectResponseDTO> {
    const existingProject = await this.projectRepository.findById(id);
    if (!existingProject) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }
    return this.projectRepository.update(id, data);
  }

  async deleteProject(id: number): Promise<ProjectResponseDTO> {
    const existingProject = await this.projectRepository.findById(id);
    if (!existingProject) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }
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