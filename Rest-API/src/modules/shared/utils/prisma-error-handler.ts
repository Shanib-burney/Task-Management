import { Prisma } from '@prisma-client';
import HTTP_STATUS_CODE from './http-status-code';

interface ParsedPrismaError {
  statusCode: number;
  message: string;
  errorCode: string;
}

export const parsePrismaError = (err: unknown): ParsedPrismaError | null => {
  /**
   * 🔴 Known Prisma Errors (P1xxx, P2xxx, P3xxx)
   */
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      /**
       * =========================
       * 🔹 P1000 - P1017 (Connection / Engine)
       * =========================
       */
      case 'P1000':
        return {
          statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: 'Database authentication failed.',
          errorCode: 'DB_AUTH_FAILED',
        };

      case 'P1001':
        return {
          statusCode: HTTP_STATUS_CODE.SERVICE_UNAVAILABLE,
          message: 'Database is not reachable.',
          errorCode: 'DB_UNREACHABLE',
        };

      case 'P1002':
        return {
          statusCode: HTTP_STATUS_CODE.GATEWAY_TIMEOUT,
          message: 'Database request timed out.',
          errorCode: 'DB_TIMEOUT',
        };

      case 'P1003':
        return {
          statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: 'Database does not exist.',
          errorCode: 'DB_NOT_FOUND',
        };

      case 'P1008':
        return {
          statusCode: 503,
          message: 'Database operation timeout.',
          errorCode: 'DB_TIMEOUT',
        };

      case 'P1009':
        return {
          statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: 'Database already exists.',
          errorCode: 'DB_ALREADY_EXISTS',
        };

      case 'P1010':
        return {
          statusCode: 403,
          message: 'Access denied to database.',
          errorCode: 'DB_ACCESS_DENIED',
        };

      case 'P1017':
        return {
          statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: 'Database connection closed.',
          errorCode: 'DB_CONNECTION_CLOSED',
        };

      /**
       * =========================
       * 🔹 P2000 - P2030 (Query Errors)
       * =========================
       */
      case 'P2000':
        return {
          statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
          message: 'Input value too long for field.',
          errorCode: 'VALUE_TOO_LONG',
        };

      case 'P2001':
        return {
          statusCode: HTTP_STATUS_CODE.NOT_FOUND,
          message: 'Record not found.',
          errorCode: 'RESOURCE_NOT_FOUND',
        };

      case 'P2002': {
        let target = (err.meta?.target as string[])?.join(', ');

        if (!target) {
          const match = err.message.match(/fields:\s*\((.+)\)/i);
          target = match && match[1] ? match[1].replace(/[`'"]/g, '') : 'unique field';
        }

        return {
          statusCode: HTTP_STATUS_CODE.CONFLICT,
          message: `${target} already exists.`,
          errorCode: 'DUPLICATE_RESOURCE',
        };
      }

      case 'P2003':
        return {
          statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
          message: 'Foreign key constraint failed.',
          errorCode: 'FOREIGN_KEY_VIOLATION',
        };

      case 'P2004':
        return {
          statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
          message: 'Database constraint failed.',
          errorCode: 'CONSTRAINT_FAILED',
        };

      case 'P2005':
        return {
          statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
          message: 'Invalid value stored in database.',
          errorCode: 'INVALID_DB_VALUE',
        };

      case 'P2006':
        return {
          statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
          message: 'Invalid input value.',
          errorCode: 'INVALID_INPUT',
        };

      case 'P2007':
        return {
          statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
          message: 'Data validation error.',
          errorCode: 'VALIDATION_ERROR',
        };

      case 'P2008':
      case 'P2009':
        return {
          statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
          message: 'Query parsing/validation error.',
          errorCode: 'INVALID_QUERY',
        };

      case 'P2010':
        return {
          statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
          message: 'Raw query execution failed.',
          errorCode: 'RAW_QUERY_FAILED',
        };

      case 'P2011':
        return {
          statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
          message: 'Null constraint violation.',
          errorCode: 'NULL_CONSTRAINT',
        };

      case 'P2012':
        return {
          statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
          message: 'Missing required value.',
          errorCode: 'MISSING_REQUIRED_VALUE',
        };

      case 'P2013':
        return {
          statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
          message: 'Missing required argument.',
          errorCode: 'MISSING_ARGUMENT',
        };

      case 'P2014':
        return {
          statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
          message: 'Invalid relation.',
          errorCode: 'RELATION_VIOLATION',
        };

      case 'P2015':
        return {
          statusCode: 404,
          message: 'Related record not found.',
          errorCode: 'RELATED_RESOURCE_NOT_FOUND',
        };

      case 'P2016':
        return {
          statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
          message: 'Query interpretation error.',
          errorCode: 'QUERY_INTERPRETATION_ERROR',
        };

      case 'P2017':
        return {
          statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
          message: 'Relation mismatch.',
          errorCode: 'RELATION_MISMATCH',
        };

      case 'P2018':
        return {
          statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
          message: 'Required relation missing.',
          errorCode: 'MISSING_RELATION',
        };

      case 'P2019':
        return {
          statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
          message: 'Input error.',
          errorCode: 'INPUT_ERROR',
        };

      case 'P2020':
        return {
          statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
          message: 'Value out of range.',
          errorCode: 'VALUE_OUT_OF_RANGE',
        };

      case 'P2021':
        return {
          statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: 'Table does not exist.',
          errorCode: 'TABLE_NOT_FOUND',
        };

      case 'P2022':
        return {
          statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: 'Column does not exist.',
          errorCode: 'COLUMN_NOT_FOUND',
        };

      case 'P2023':
        return {
          statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
          message: 'Inconsistent column data.',
          errorCode: 'INCONSISTENT_DATA',
        };

      case 'P2024':
        return {
          statusCode: HTTP_STATUS_CODE.SERVICE_UNAVAILABLE,
          message: 'Database connection timeout.',
          errorCode: 'DB_TIMEOUT',
        };

      case 'P2025':
        return {
          statusCode: HTTP_STATUS_CODE.NOT_FOUND,
          message: 'Record not found.',
          errorCode: 'RESOURCE_NOT_FOUND',
        };

      case 'P2026':
        return {
          statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
          message: 'Unsupported feature.',
          errorCode: 'UNSUPPORTED_FEATURE',
        };

      case 'P2027':
        return {
          statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: 'Multiple database errors occurred.',
          errorCode: 'MULTIPLE_ERRORS',
        };

      case 'P2028':
        return {
          statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: 'Transaction failed.',
          errorCode: 'TRANSACTION_FAILED',
        };

      case 'P2029':
        return {
          statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
          message: 'Query parameter limit exceeded.',
          errorCode: 'QUERY_LIMIT_EXCEEDED',
        };

      case 'P2030':
        return {
          statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
          message: 'Full-text search error.',
          errorCode: 'FULLTEXT_ERROR',
        };

      /**
       * =========================
       * 🔹 P3000+ (Migrations)
       * =========================
       */
      case 'P3000':
      case 'P3001':
      case 'P3002':
      case 'P3003':
      case 'P3004':
      case 'P3005':
      case 'P3006':
      case 'P3007':
      case 'P3008':
      case 'P3009':
      case 'P3010':
        return {
          statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: 'Migration error occurred.',
          errorCode: 'MIGRATION_ERROR',
        };

      default:
        return {
          statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: 'Unknown database error.',
          errorCode: err.code,
        };
    }
  }

  /**
   * 🔴 Validation Errors
   */
  if (err instanceof Prisma.PrismaClientValidationError) {
    console.error('Prisma Validation Error:', err.message);
    return {
      statusCode: HTTP_STATUS_CODE.CONFLICT,
      message: 'Invalid input data provided.',
      errorCode: 'VALIDATION_ERROR',
    };
  }

  /**
   * 🔴 Initialization Errors
   */
  if (err instanceof Prisma.PrismaClientInitializationError) {
    return {
      statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
      message: 'Database initialization failed.',
      errorCode: 'DB_INIT_FAILED',
    };
  }

  /**
   * 🔴 Unknown Request Errors
   */
  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    return {
      statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
      message: 'Unknown database error occurred.',
      errorCode: 'UNKNOWN_DB_ERROR',
    };
  }

  /**
   * 🔴 Rust Panic (CRITICAL)
   */
  if (err instanceof Prisma.PrismaClientRustPanicError) {
    return {
      statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
      message: 'Critical database engine error.',
      errorCode: 'DB_ENGINE_CRASH',
    };
  }

  return null;
};

type PrismaAnyError =
  | Prisma.PrismaClientKnownRequestError
  | Prisma.PrismaClientUnknownRequestError
  | Prisma.PrismaClientInitializationError
  | Prisma.PrismaClientValidationError
  | Prisma.PrismaClientRustPanicError;

export function isPrismaError(err: unknown): err is PrismaAnyError {
  return (
    err instanceof Prisma.PrismaClientKnownRequestError ||
    err instanceof Prisma.PrismaClientUnknownRequestError ||
    err instanceof Prisma.PrismaClientInitializationError ||
    err instanceof Prisma.PrismaClientValidationError ||
    err instanceof Prisma.PrismaClientRustPanicError
  );
}
