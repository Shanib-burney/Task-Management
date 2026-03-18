import { Request, Response } from "express";
import { TeamService } from "./team.service";

export class TeamController {
  private teamService: TeamService;

  constructor(teamService: TeamService) {
    this.teamService = teamService;
  }

  async getAllTeams(req: Request, res: Response): Promise<void> {
    try {
      const teams = await this.teamService.getAllTeams();
      res.json(teams);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ error: message });
    }
  }

  async getTeamById(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: "Invalid team ID" });
      return;
    }
    try {
      const team = await this.teamService.getTeamById(id);
      if (!team) {
        res.status(404).json({ error: "Team not found" });
        return;
      }
      res.json(team);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ error: message });
    }
  }

  async createTeam(req: Request, res: Response): Promise<void> {
    const { name, status } = req.body;
    if (!name || status === undefined) {
      res.status(400).json({ error: "name and status are required" });
      return;
    }
    try {
      const team = await this.teamService.createTeam({ name, status: Number(status) });
      res.status(201).json(team);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ error: message });
    }
  }

  async updateTeam(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: "Invalid team ID" });
      return;
    }
    const { name, status } = req.body;
    try {
      const team = await this.teamService.updateTeam(id, {
        name,
        status: status !== undefined ? Number(status) : undefined,
      });
      res.json(team);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      if (message.includes("Record to update not found")) {
        res.status(404).json({ error: "Team not found" });
        return;
      }
      res.status(500).json({ error: message });
    }
  }

  async deleteTeam(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: "Invalid team ID" });
      return;
    }
    try {
      await this.teamService.deleteTeam(id);
      res.status(204).send();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      if (message.includes("Record to delete does not exist")) {
        res.status(404).json({ error: "Team not found" });
        return;
      }
      res.status(500).json({ error: message });
    }
  }
}
