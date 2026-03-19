import { Request, Response } from "express";
import { ProjectService } from "./project.service";
import { CreateProjectBody, UpdateProjectBody } from "./project.validators";
import HTTP_STATUS_CODE from "../shared/utils/http-status-code";

export class ProjectController {
  private projectService: ProjectService;

  constructor(projectService: ProjectService) {
    this.projectService = projectService;
  }

  async getAllProjects(req: Request, res: Response): Promise<void> {
    try {
      const projects = await this.projectService.getAllProjects();
      res.json(projects);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ error: message });
    }
  }

  async getProjectById(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: "Invalid project ID" });
      return;
    }
    try {
      const project = await this.projectService.getProjectById(id);
      if (!project) {
        res.status(HTTP_STATUS_CODE.NOT_FOUND).json({ error: "Project not found" });
        return;
      }
      res.json(project);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ error: message });
    }
  }

  async createProject(req: Request<{}, {}, CreateProjectBody>, res: Response): Promise<void> {
    try {
      const {name, ownerId, teamId , status} = req.body;
      const project = await this.projectService.createProject({ name, ownerId, teamId, status : status ?? 0 });
      res.status(201).json(project);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ error: message });
    }
  }

  async updateProject(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: "Invalid project ID" });
      return;
    }
    try {
      const project = await this.projectService.updateProject(id, req.body);
      res.json(project);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      if (message.includes("Record to update not found")) {
        res.status(404).json({ error: "Project not found" });
        return;
      }
      res.status(500).json({ error: message });
    }
  }

  async deleteProject(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: "Invalid project ID" });
      return;
    }
    try {
      await this.projectService.deleteProject(id);
      res.status(204).send();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      if (message.includes("Record to delete does not exist")) {
        res.status(404).json({ error: "Project not found" });
        return;
      }
      res.status(500).json({ error: message });
    }
  }
}
