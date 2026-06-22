export type UserMapper = {
  id: number;
  name: string;
  email: string;
  role: number;
  status: number;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ProjectMapper = {
  id: number;
  name: string;
  status: number;
  teamId: number;
  ownerId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type TaskMapper = {
  id: number;
  title: string;
  description: string | null;
  status: number;
  projectId: number;
  assigneeId: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export type TeamMapper = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};
