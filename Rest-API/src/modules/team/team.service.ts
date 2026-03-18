import { TeamRepository } from "./team.repository";
import { Team } from "../../generated/prisma/client";

export class TeamService {
  private teamRepository: TeamRepository;

  constructor(teamRepository: TeamRepository) {
    this.teamRepository = teamRepository;
  }

  async getAllTeams(): Promise<Team[]> {
    return this.teamRepository.findMany();
  }

  async getTeamById(id: number): Promise<Team | null> {
    return this.teamRepository.findUnique(id);
  }

  async createTeam(data: Omit<Team, "id" | "createdAt" | "updatedAt">): Promise<Team> {
    // Add any business logic/validation here before calling the repository
    return this.teamRepository.create(data);
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