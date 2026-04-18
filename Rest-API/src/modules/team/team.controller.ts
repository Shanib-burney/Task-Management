import { Request, Response } from 'express';
import { TeamService } from './team.service';
import { CreateTeamDTO, UpdateTeamDTO } from './team.validators';
import { BadRequestException } from '../shared/utils/exceptions';
import HTTP_STATUS_CODE from '../shared/utils/http-status-code';
import { logger } from '../shared/utils/logger';
import { pagingDTO } from '../shared/utils/utils';

export class TeamController {
  private teamService: TeamService;

  constructor(teamService: TeamService) {
    this.teamService = teamService;
  }

  async getAllTeams(req: Request, res: Response<{}, { validatedQuery: pagingDTO }>): Promise<void> {
    try {
      const teams = await this.teamService.getAllTeams();
      res.json(teams);
    } catch (error: unknown) {
      throw error;
    }
  }

  async getTeamById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        throw new BadRequestException('Invalid team ID');
      }

      const team = await this.teamService.getTeamById(id);
      res.json(team);
    } catch (error: unknown) {
      logger.warn('Failed to fetch team by id', { error, requestId: req.requestId });
      throw error;
    }
  }

  async createTeam(req: Request<{}, {}, CreateTeamDTO>, res: Response): Promise<void> {
    try {
      const team = await this.teamService.createTeam(req.body);
      res.status(HTTP_STATUS_CODE.CREATED).json(team);
    } catch (error: unknown) {
      throw error;
    }
  }

  async patchTeam(req: Request<{ id: string }, {}, UpdateTeamDTO>, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        throw new BadRequestException('Invalid team ID');
      }

      const team = await this.teamService.updateTeam(id, req.body);
      res.json(team);
    } catch (error: unknown) {
      throw error;
    }
  }

  async deleteTeam(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        throw new BadRequestException('Invalid team ID');
      }

      await this.teamService.deleteTeam(id);
      res.status(HTTP_STATUS_CODE.NO_CONTENT).send();
    } catch (error: unknown) {
      throw error;
    }
  }
  async addMember(req: Request<{ id: string; userId: string }>, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const userId = Number(req.params.userId);
      if (Number.isNaN(id) || Number.isNaN(userId)) {
        throw new BadRequestException('Invalid team ID or user ID');
      }

      const team = await this.teamService.addMember(id, userId);
      res.json(team);
    } catch (error: unknown) {
      throw error;
    }
  }
}
