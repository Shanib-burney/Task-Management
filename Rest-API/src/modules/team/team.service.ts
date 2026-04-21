import { TeamRepository } from './team.repository';
import { Team } from '@prisma-client';
import { getTakeSkip, PaginatedResponse, pagingDTO } from '../shared/utils/utils';
export class TeamService {
  private teamRepository: TeamRepository;

  constructor(teamRepository: TeamRepository) {
    this.teamRepository = teamRepository;
  }

  async getAllTeams(page?: pagingDTO): Promise<PaginatedResponse<Team>> {
    const options = getTakeSkip(page);

    return this.teamRepository.findMany(options);
  }

  async getTeamById(id: number): Promise<Team | null> {
    return this.teamRepository.findById(id);
  }

  async createTeam(data: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>): Promise<Team> {
    return this.teamRepository.create({ name: data.name });
  }

  async updateTeam(id: number, data: Partial<Omit<Team, 'id'>>): Promise<Team> {
    // Add any business logic/validation here
    return this.teamRepository.update(id, data);
  }
  async addMember(id: number, userId: number): Promise<Team> {
    // Add any business logic/validation here
    return this.teamRepository.addMember(id, userId);
  }

  async deleteTeam(id: number): Promise<Team> {
    // Add any business logic/validation here
    return this.teamRepository.delete(id);
  }
}
