import { TeamRepository } from "./team.repository";
import { Team } from "@prisma-client";
import { PaginatedResponse, pagingDTO } from "modules/shared/utils/utils";
export class TeamService {
  private teamRepository: TeamRepository;

  constructor(teamRepository: TeamRepository) {
    this.teamRepository = teamRepository;
  }

  async getAllTeams(page?: pagingDTO): Promise<PaginatedResponse<Team>> {
    return this.teamRepository.findMany();
  }

  async getTeamById(id: number): Promise<Team | null> {
    return this.teamRepository.findById(id);
  }

  async createTeam(data: Omit<Team, "id" | "createdAt" | "updatedAt">): Promise<Team> {
    return this.teamRepository.create({name: data.name});
  }

  async updateTeam(id: number, data: Partial<Omit<Team, "id">>): Promise<Team> {
    // Add any business logic/validation here
    return this.teamRepository.update(id, data);
  }

  async deleteTeam(id: number): Promise<Team> {
    // Add any business logic/validation here
    return this.teamRepository.delete(id);
  }
}