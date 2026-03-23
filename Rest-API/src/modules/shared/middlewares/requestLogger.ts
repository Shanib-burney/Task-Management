import { randomUUID } from "crypto";
import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestId = req.get("X-Request-Id") || randomUUID();

  // Attach directly to the request object (TypeScript knows this is legal now!)
  req.requestId = requestId; 

  // Still send it back to the client
  res.setHeader("X-Request-Id", requestId);
  
  const start = Date.now();

  logger.info(`➡️  ${req.method} ${req.originalUrl}`, { requestId });

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(`⬅️  ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`, {
      requestId,
      statusCode: res.statusCode,
      duration,
    });
  });

  next();
};