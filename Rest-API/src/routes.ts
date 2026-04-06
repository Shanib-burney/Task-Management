import type { Application } from "express";
import userRoutes from "./modules/user/user.routes";
import teamRoutes from "./modules/team/team.routes";
import projectRoutes from "./modules/project/project.routes";

export const setupRoutes = (app: Application) => {
  app.use("/users", userRoutes);
  app.use("/teams", teamRoutes);
  app.use("/projects", projectRoutes);
};