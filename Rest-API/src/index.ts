import express from "express";
import type { Application, Request, Response } from "express";
import dotenv from "dotenv";
import { prisma } from "./db/prisma-client";
import userRoutes from "./modules/user/user.routes";
import teamRoutes from "./modules/team/team.routes";
import projectRoutes from "./modules/project/project.routes";
import { errorHandler } from "./modules/shared/middlewares/errorHandler";
import { requestLogger } from "./modules/shared/middlewares/requestLogger";
import { logger } from "./modules/shared/utils/logger";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(requestLogger);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Express & TypeScript Server");
})



app.use("/users", userRoutes);
app.use("/teams", teamRoutes);
app.use("/projects", projectRoutes);



// Global error handler (won't catch the above!)
app.use(errorHandler);



process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  //  process.exit(1)
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  //  process.exit(1)
});

app.listen(PORT, async () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
  try {
    await prisma.$connect();
    logger.info("Database connected successfully");
  } catch (error) {
    logger.error("Database connection failed:", error);
  }
});



// app.get("/error", async (req: Request, res: Response) => {

//   // 1. Synchronous crash
//   // throw new Error("Crash! Synchronous");

//   // // // 2. Asynchronous crash outside Express promise chain
//   // setTimeout(() => {
//   //   throw new Error("Crash! Async inside setTimeout");
//   // }, 100);

//   // 3. Unhandled promise rejection outside route chain
//   Promise.reject(new Error("Crash! Unhandled rejection"));

//   // const data = await Promise.reject(new Error("Something went wrong! error"));

//   res.json({ok:"ok"})

// });