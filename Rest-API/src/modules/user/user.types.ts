import { User } from "../../generated/prisma/client";

export type CreateUserDTO = Omit<User, "id" | "createdAt" | "updatedAt" | "passwordHash"> & {
  password: string;
};

export type UpdateUserDTO = Partial<CreateUserDTO>;