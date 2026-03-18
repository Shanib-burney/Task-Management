import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  role: z.number().int(),
  status: z.number().int(),
  passwordHash: z.string().min(6),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.email().optional(),
  role: z.number().int().optional(),
  status: z.number().int().optional(),
  passwordHash: z.string().min(6).optional(),
});
