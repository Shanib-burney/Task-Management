import { User } from "../../generated/prisma/client";

// export type CreateUserDTO = Omit<User, "id" | "createdAt" | "updatedAt" | "passwordHash"> & {
//   password: string;
// };

// export type UpdateUserDTO = Partial<CreateUserDTO>;

export type UserWithoutPassword = Omit<User, "passwordHash">;

export type UserResponseDTO = Omit<User, "passwordHash" | "role" | "status"> & {
  role: string;
  status: string;
};

export interface PaginationOptions {
  page: number;
  size: number;
  paging: boolean;
}

