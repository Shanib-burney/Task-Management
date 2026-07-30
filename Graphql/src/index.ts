import express from "express";
import type { Application, Request, RequestHandler, Response } from "express";
import dotenv from "dotenv";
import "module-alias/register";
import cors from "cors";
import jwt from "jsonwebtoken";
import { expressMiddleware } from '@as-integrations/express5';
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageProductionDefault } from "@apollo/server/plugin/landingPage/default";

import { prisma } from "./db/prisma-client";
import { logger } from "./shared/utils/logger";

import { schema } from "./schema";
import { createLoaders, type AuthUser } from "./context";
import { JWT_SECRET } from "./shared/utils/constants";
import { UserRole } from "./modules/user/user.enum";

function getUserFromAuthHeader(authHeader: string | undefined): AuthUser | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  try {
    const payload = jwt.verify(authHeader.slice("Bearer ".length), JWT_SECRET) as {
      userId: number;
      role: keyof typeof UserRole;
    };
    return { id: payload.userId, role: UserRole[payload.role] };
  } catch {
    return null;
  }
}

// import { setupRoutes } from './routes';
// import { errorHandler } from './modules/shared/middlewares/errorHandler';
// import { requestLogger } from './modules/shared/middlewares/requestLogger';

dotenv.config({ override: true });

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Express + Apollo GraphQL Server");
});

// setupRoutes(app);

// 🔥 Apollo Setup
async function startApolloServer() {
  const isLocalEnv = process.env.NODE_ENV?.trim().toLowerCase() === "local";
  console.log("is Local", isLocalEnv, process.env.NODE_ENV)

  const server = new ApolloServer({
    schema,
    introspection: isLocalEnv,
    plugins: isLocalEnv
      ? [ApolloServerPluginLandingPageLocalDefault()]
      : [ApolloServerPluginLandingPageProductionDefault()],
  });

  await server.start();

  app.use(
    "/graphql",
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }: any) => {
        return {
          prisma,
          loaders: createLoaders(prisma),
          user: getUserFromAuthHeader(req.headers.authorization),
          logger,
        };
      },
    }) as unknown as RequestHandler
  );

}


// Export app for testing
export { app };

// Database connection + Server start
if (process.env.NODE_ENV !== "test") {
  (async () => {
    try {
      await prisma.$connect();
      await prisma.$executeRaw`SELECT 1`;

      logger.info(
        `Database connected successfully at ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
      );

      // 👉 Start Apollo AFTER DB is ready
      await startApolloServer();

      app.listen(PORT, () => {
        logger.info(`🚀 REST: http://localhost:${PORT}`);
        logger.info(`🚀 GraphQL: http://localhost:${PORT}/graphql`);
      });
    } catch (error) {
      logger.error("Startup failed:", error);
      process.exit(1);
    }
  })();
}

// Global handlers
process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
});
