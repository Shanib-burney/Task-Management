import { Prisma } from "../../../generated/prisma/client";
import HTTP_STATUS_CODE from "./http-status-code";

interface ParsedPrismaError {
  statusCode: number;
  message: string;
  errorCode: string;
}

export const parsePrismaError = (
  err: Prisma.PrismaClientKnownRequestError
): ParsedPrismaError | null => {
  switch (err.code) {
    // P2002: Unique constraint failed
    case "P2002": {
      let target = (err.meta?.target as string[])?.join(", ");
      
      if (!target) {
        const match = err.message.match(/fields:\s*\((.+)\)/i);
        target = match && match[1] ? match[1].replace(/[`'"]/g, "") : "a unique field";
      }

      const formattedField = target.charAt(0).toUpperCase() + target.slice(1);
      return {
        statusCode: HTTP_STATUS_CODE.CONFLICT, // 409
        message: `${formattedField} already exists.`,
        errorCode: "DUPLICATE_RESOURCE",
      };
    }

    // P2025: Record to update/delete not found
    case "P2025": {
      return {
        statusCode: HTTP_STATUS_CODE.NOT_FOUND, // 404
        message: "The requested resource was not found.",
        errorCode: "RESOURCE_NOT_FOUND",
      };
    }

    // P2003: Foreign key constraint failed
    case "P2003": {
      let field = err.meta?.field_name as string;
      if (!field) {
        const match = err.message.match(/field:\s*(.+)/i);
        field = match && match[1] ? match[1].replace(/[`'"]/g, "") : "a related field";
      }
      return {
        statusCode: HTTP_STATUS_CODE.BAD_REQUEST, // 400
        message: `Invalid reference provided for ${field}.`,
        errorCode: "FOREIGN_KEY_VIOLATION",
      };
    }

    // If it's a Prisma error we haven't explicitly mapped, return null 
    // so the global handler can default to a 500 Internal Server Error
    default:
      return null;
  }
};