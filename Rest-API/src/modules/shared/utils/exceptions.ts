import HTTP_STATUS_CODE from "./http-status-code";

export class HttpException extends Error {
  statusCode: number;
  errorCode?: string;
  details?: any;

  constructor(
    message: string,
    statusCode: number,
    errorCode?: string,
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

// 400
export class BadRequestException extends HttpException {
  constructor(message = "Bad Request", details?: any) {
    super(message, HTTP_STATUS_CODE.BAD_REQUEST, "BAD_REQUEST", details);
  }
}

// 401
export class UnauthorizedException extends HttpException {
  constructor(message = "Unauthorized") {
    super(message, HTTP_STATUS_CODE.UNAUTHORIZED, "UNAUTHORIZED");
  }
}

// 403
export class ForbiddenException extends HttpException {
  constructor(message = "Forbidden") {
    super(message, HTTP_STATUS_CODE.FORBIDDEN, "FORBIDDEN");
  }
}

// 404
export class NotFoundException extends HttpException {
  constructor(message = "Resource Not Found") {
    super(message, HTTP_STATUS_CODE.NOT_FOUND, "NOT_FOUND");
  }
}

// 409
export class ConflictException extends HttpException {
  constructor(message = "Conflict") {
    super(message, HTTP_STATUS_CODE.CONFLICT, "CONFLICT");
  }
}

// 422
export class UnprocessableEntityException extends HttpException {
  constructor(message = "Validation Failed", details?: any) {
    super(
      message,
      HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY,
      "UNPROCESSABLE_ENTITY",
      details
    );
  }
}

// 429
export class TooManyRequestsException extends HttpException {
  constructor(message = "Too Many Requests") {
    super(
      message,
      HTTP_STATUS_CODE.TOO_MANY_REQUESTS,
      "TOO_MANY_REQUESTS"
    );
  }
}

// 500
export class InternalServerException extends HttpException {
  constructor(message = "Internal Server Error") {
    super(
      message,
      HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
      "INTERNAL_SERVER_ERROR"
    );
  }
}

// 503
export class ServiceUnavailableException extends HttpException {
  constructor(message = "Service Unavailable") {
    super(
      message,
      HTTP_STATUS_CODE.SERVICE_UNAVAILABLE,
      "SERVICE_UNAVAILABLE"
    );
  }
}