import { Request, Response } from 'express';
import { ProjectService } from './project.service';
import { CreateProjectDTO, CreateTasksDTO, UpdateProjectDTO } from './project.validators';
import { BadRequestException } from '../shared/utils/exceptions';
import HTTP_STATUS_CODE from '../shared/utils/http-status-code';
import { logger } from '../shared/utils/logger';
import { pagingDTO } from '../shared/utils/utils';

export class ProjectController {
  private projectService: ProjectService;

  constructor(projectService: ProjectService) {
    this.projectService = projectService;
  }

  async getAllProjects(
    req: Request,
    res: Response<{}, { validatedQuery: pagingDTO }>,
  ): Promise<void> {
    try {
      const projects = await this.projectService.getAllProjects(res.locals.validatedQuery);
      res.json(projects);
    } catch (error: unknown) {
      throw error;
    }
  }

  async getProjectById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        throw new BadRequestException('Invalid project ID');
      }

      const project = await this.projectService.getProjectById(id);
      res.json(project);
    } catch (error: unknown) {
      logger.warn('Failed to fetch project by id', { error, requestId: req.requestId });
      throw error;
    }
  }

  async createProject(req: Request<{}, {}, CreateProjectDTO>, res: Response): Promise<void> {
    try {
      const project = await this.projectService.createProject(req.body);
      res.status(HTTP_STATUS_CODE.CREATED).json(project);
    } catch (error: unknown) {
      throw error;
    }
  }

  async patchProject(
    req: Request<{ id: string }, {}, UpdateProjectDTO>,
    res: Response,
  ): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        throw new BadRequestException('Invalid project ID');
      }

      const project = await this.projectService.updateProject(id, req.body);
      res.json(project);
    } catch (error: unknown) {
      throw error;
    }
  }

  async deleteProject(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        throw new BadRequestException('Invalid project ID');
      }

      await this.projectService.deleteProject(id);
      res.status(HTTP_STATUS_CODE.NO_CONTENT).send();
    } catch (error: unknown) {
      throw error;
    }
  }

  async createTasks(req: Request<{ id: string }, {}, CreateTasksDTO>, res: Response) {
    const id = Number(req.params.id);
    const data = await this.projectService.createTasks(id, req.body);
    res.status(HTTP_STATUS_CODE.CREATED).json(data);
  }
}
