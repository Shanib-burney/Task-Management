import { Project } from '@prisma-client';
import { ProjectRepository } from './project.repository';
import { CreateProjectDTO, CreateTasksDTO, UpdateProjectDTO } from './project.validators';
import { NotFoundException } from '../shared/utils/exceptions';
import { getTakeSkip, PaginatedResponse, pagingDTO } from '../shared/utils/utils';
import { UserRepository } from '../user/user.repository';

export class ProjectService {
  private projectRepository: ProjectRepository;
  private userRepository: UserRepository;

  constructor(projectRepository: ProjectRepository, userRepository: UserRepository) {
    this.projectRepository = projectRepository;
    this.userRepository = userRepository;
  }

  async getAllProjects(page?: pagingDTO): Promise<PaginatedResponse<Project>> {
    const options = getTakeSkip(page);

    return this.projectRepository.findMany(options);
  }

  async getProjectById(id: number): Promise<Project> {
    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }
    return project;
  }

  async createProject(data: CreateProjectDTO): Promise<Project> {
    return this.projectRepository.create({
      name: data.name,
      status: data.status ?? 0,
      owner: { connect: { id: data.ownerId } },
      team: { connect: { id: data.teamId } },
      tasks: data.tasks
        ? {
            create: data.tasks,
          }
        : undefined,
    });
  }

  async createTasks(id: number, data: CreateTasksDTO) {
    if (data.tasks.length === 0) {
      throw new NotFoundException(`No tasks provided to create for project with id ${id}`);
    }

    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }

    const teamMembers = await this.userRepository.getTeamMembers(project.teamId);
    const teamMemberIds = teamMembers.map((member) => member.id);

    for (const task of data.tasks) {
      if (task.comments) {
        for (const comment of task.comments) {
          if (!teamMemberIds.includes(comment.authorId)) {
            throw new NotFoundException(
              `Comment author ${comment.authorId} is not part of the project team`,
            );
          }
        }
      }
    }

    const tasksData = data.tasks.map((task) => ({
      title: task.title,
      description: task.description,
      status: task.status ?? 0,
      comments: task.comments
        ? {
            create: task.comments,
          }
        : undefined,
    }));

    return this.projectRepository.createTasks(id, tasksData);
  }

  async updateProject(id: number, data: UpdateProjectDTO): Promise<Project> {
    const existingProject = await this.projectRepository.findById(id);
    if (!existingProject) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }
    return this.projectRepository.update(id, data);
  }

  async deleteProject(id: number): Promise<Project> {
    const existingProject = await this.projectRepository.findById(id);
    if (!existingProject) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }
    return this.projectRepository.delete(id);
  }
}
