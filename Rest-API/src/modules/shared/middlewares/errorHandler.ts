import { Request, Response, NextFunction } from "express";
import { HttpException } from "../utils/exceptions";
import { logger } from "../utils/logger";
import HTTP_STATUS_CODE from "../utils/http-status-code";
import { Prisma } from "../../../generated/prisma/client";
import { parsePrismaError } from "../utils/prisma-error-handler";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {

  const requestId = req.requestId;

  if (err instanceof HttpException) {
    logger.warn(`Handled HTTP Exception: ${err.message}`, { requestId });
    return res.status(err.statusCode).json({
      message: err.message,
      errorCode: err.errorCode,
      details: err.details || undefined,
      path: req.originalUrl,
      timestamp: new Date().toISOString(),
      requestId,
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaError = parsePrismaError(err);

    if (prismaError) {
      // Log it cleanly based on the parsed data
      logger.warn(`Handled DB error: ${prismaError.message}`, { requestId, code: err.code });

      return res.status(prismaError.statusCode).json({
        message: prismaError.message,
        errorCode: prismaError.errorCode,
        path: req.originalUrl,
        timestamp: new Date().toISOString(),
        requestId,
      });
    }

  }

  // 3. Catch-all for Express/Middleware generated HTTP errors (e.g., body-parser, multer)
  // These libraries attach a 'status' or 'statusCode' property to the error.

  const middlewareStatus = err.status || err.statusCode;

  if (middlewareStatus && middlewareStatus >= 400 && middlewareStatus < 500) {
    logger.warn(`Middleware Client Error [${middlewareStatus}]: ${err.message}`, { requestId });

    return res.status(middlewareStatus).json({
      // Pass the middleware's message (e.g., "Unexpected end of JSON input") 
      // or default to a generic "Bad Request"
      message: err.message || "Bad Request",
      errorCode: "CLIENT_ERROR",
      path: req.originalUrl,
      timestamp: new Date().toISOString(),
      requestId,
    });
  }
  // Unknown error
  logger.error(`Unhandled error: ${err.message || err}`, { requestId });


  res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
    message: "Internal Server Error, please check the service logs for more details.",
    errorCode: "INTERNAL_SERVER_ERROR",
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
    requestId,
  });
};