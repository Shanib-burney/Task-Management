import { Project } from "../../generated/prisma/client";

export type ProjectResponseDTO = Project;
export type ProjectCreateData = Omit<Project, "id" | "createdAt" | "updatedAt">;
export type ProjectUpdateData = Partial<Omit<Project, "id">>;

const enum TaskStatus {
  ToDO = 0,
  InProgress = 1,
  Done = 2,
}
