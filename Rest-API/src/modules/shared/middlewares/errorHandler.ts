import { Request, Response, NextFunction } from "express";
import { HttpException } from "../utils/exceptions";
import HTTP_STATUS_CODE from "../utils/http-status-code";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("ERROR:", err);

  // Known (custom) errors
  if (err instanceof HttpException) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errorCode: err.errorCode,
      details: err.details || null,
      path: req.originalUrl,
      timestamp: new Date().toISOString(),
    });
  }

  // Unknown errors
  return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "Internal Server Error",
    errorCode: "INTERNAL_SERVER_ERROR",
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
};