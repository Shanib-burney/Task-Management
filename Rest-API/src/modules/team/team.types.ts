import { Team } from "@prisma-client";

export type TeamResponseDTO = Team;
export type TeamCreateData = Omit<Team, "id" | "createdAt" | "updatedAt">;
export type TeamUpdateData = Partial<Omit<Team, "id">>;
