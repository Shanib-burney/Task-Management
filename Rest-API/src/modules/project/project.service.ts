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
