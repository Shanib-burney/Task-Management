import { z } from "zod";
import { enumSchema } from "../shared/utils/utils";
import { UserRoles, UserStatus } from "./user.enum";

export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  role: enumSchema(UserRoles).optional(),
  status: enumSchema(UserStatus).optional(),
  password: z.string().min(6),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.email().optional(),
  role: z.number().int().optional(),
  status: z.number().int().optional(),
  password: z.string().min(6).optional(),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;