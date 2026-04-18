import {
  HttpException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
  UnprocessableEntityException,
  TooManyRequestsException,
  InternalServerException,
  ServiceUnavailableException,
} from './exceptions';
import HTTP_STATUS_CODE from './http-status-code';

describe('Exceptions', () => {
  describe('HttpException', () => {
    it('should create exception with all properties', () => {
      const exception = new HttpException('Test message', 400, 'TEST_ERROR', { details: 'test' });

      expect(exception.message).toBe('Test message');
      expect(exception.statusCode).toBe(400);
      expect(exception.errorCode).toBe('TEST_ERROR');
      expect(exception.details).toEqual({ details: 'test' });
    });

    it('should create exception without errorCode and details', () => {
      const exception = new HttpException('Test message', 400);

      expect(exception.message).toBe('Test message');
      expect(exception.statusCode).toBe(400);
      expect(exception.errorCode).toBeUndefined();
      expect(exception.details).toBeUndefined();
    });
  });

  describe('BadRequestException', () => {
    it('should create with default message', () => {
      const exception = new BadRequestException();

      expect(exception.message).toBe('Bad Request');
      expect(exception.statusCode).toBe(HTTP_STATUS_CODE.BAD_REQUEST);
      expect(exception.errorCode).toBe('BAD_REQUEST');
    });

    it('should create with custom message', () => {
      const exception = new BadRequestException('Custom bad request');

      expect(exception.message).toBe('Custom bad request');
      expect(exception.statusCode).toBe(HTTP_STATUS_CODE.BAD_REQUEST);
      expect(exception.errorCode).toBe('BAD_REQUEST');
    });

    it('should accept details', () => {
      const details = { field: 'email', issue: 'invalid format' };
      const exception = new BadRequestException('Invalid email', details);

      expect(exception.details).toBe(details);
    });
  });

  describe('UnauthorizedException', () => {
    it('should create with default message', () => {
      const exception = new UnauthorizedException();

      expect(exception.message).toBe('Unauthorized');
      expect(exception.statusCode).toBe(HTTP_STATUS_CODE.UNAUTHORIZED);
      expect(exception.errorCode).toBe('UNAUTHORIZED');
    });

    it('should create with custom message', () => {
      const exception = new UnauthorizedException('Custom unauthorized');

      expect(exception.message).toBe('Custom unauthorized');
      expect(exception.statusCode).toBe(HTTP_STATUS_CODE.UNAUTHORIZED);
      expect(exception.errorCode).toBe('UNAUTHORIZED');
    });
  });

  describe('ForbiddenException', () => {
    it('should create with default message', () => {
      const exception = new ForbiddenException();

      expect(exception.message).toBe('Forbidden');
      expect(exception.statusCode).toBe(HTTP_STATUS_CODE.FORBIDDEN);
      expect(exception.errorCode).toBe('FORBIDDEN');
    });

    it('should create with custom message', () => {
      const exception = new ForbiddenException('Custom forbidden');

      expect(exception.message).toBe('Custom forbidden');
      expect(exception.statusCode).toBe(HTTP_STATUS_CODE.FORBIDDEN);
      expect(exception.errorCode).toBe('FORBIDDEN');
    });
  });

  describe('NotFoundException', () => {
    it('should create with default message', () => {
      const exception = new NotFoundException();

      expect(exception.message).toBe('Resource Not Found');
      expect(exception.statusCode).toBe(HTTP_STATUS_CODE.NOT_FOUND);
      expect(exception.errorCode).toBe('NOT_FOUND');
    });

    it('should create with custom message', () => {
      const exception = new NotFoundException('Custom not found');

      expect(exception.message).toBe('Custom not found');
      expect(exception.statusCode).toBe(HTTP_STATUS_CODE.NOT_FOUND);
      expect(exception.errorCode).toBe('NOT_FOUND');
    });
  });

  describe('ConflictException', () => {
    it('should create with default message', () => {
      const exception = new ConflictException();

      expect(exception.message).toBe('Conflict');
      expect(exception.statusCode).toBe(HTTP_STATUS_CODE.CONFLICT);
      expect(exception.errorCode).toBe('CONFLICT');
    });

    it('should create with custom message', () => {
      const exception = new ConflictException('Custom conflict');

      expect(exception.message).toBe('Custom conflict');
      expect(exception.statusCode).toBe(HTTP_STATUS_CODE.CONFLICT);
      expect(exception.errorCode).toBe('CONFLICT');
    });
  });

  describe('UnprocessableEntityException', () => {
    it('should create with default message', () => {
      const exception = new UnprocessableEntityException();

      expect(exception.message).toBe('Validation Failed');
      expect(exception.statusCode).toBe(HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY);
      expect(exception.errorCode).toBe('UNPROCESSABLE_ENTITY');
    });

    it('should create with custom message', () => {
      const exception = new UnprocessableEntityException('Custom validation error');

      expect(exception.message).toBe('Custom validation error');
      expect(exception.statusCode).toBe(HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY);
      expect(exception.errorCode).toBe('UNPROCESSABLE_ENTITY');
    });

    it('should accept details', () => {
      const details = { validationErrors: ['email is required'] };
      const exception = new UnprocessableEntityException('Validation failed', details);

      expect(exception.details).toBe(details);
    });
  });

  describe('TooManyRequestsException', () => {
    it('should create with default message', () => {
      const exception = new TooManyRequestsException();

      expect(exception.message).toBe('Too Many Requests');
      expect(exception.statusCode).toBe(HTTP_STATUS_CODE.TOO_MANY_REQUESTS);
      expect(exception.errorCode).toBe('TOO_MANY_REQUESTS');
    });

    it('should create with custom message', () => {
      const exception = new TooManyRequestsException('Custom rate limit');

      expect(exception.message).toBe('Custom rate limit');
      expect(exception.statusCode).toBe(HTTP_STATUS_CODE.TOO_MANY_REQUESTS);
      expect(exception.errorCode).toBe('TOO_MANY_REQUESTS');
    });
  });

  describe('InternalServerException', () => {
    it('should create with default message', () => {
      const exception = new InternalServerException();

      expect(exception.message).toBe('Internal Server Error');
      expect(exception.statusCode).toBe(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
      expect(exception.errorCode).toBe('INTERNAL_SERVER_ERROR');
    });

    it('should create with custom message', () => {
      const exception = new InternalServerException('Custom server error');

      expect(exception.message).toBe('Custom server error');
      expect(exception.statusCode).toBe(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
      expect(exception.errorCode).toBe('INTERNAL_SERVER_ERROR');
    });
  });

  describe('ServiceUnavailableException', () => {
    it('should create with default message', () => {
      const exception = new ServiceUnavailableException();

      expect(exception.message).toBe('Service Unavailable');
      expect(exception.statusCode).toBe(HTTP_STATUS_CODE.SERVICE_UNAVAILABLE);
      expect(exception.errorCode).toBe('SERVICE_UNAVAILABLE');
    });

    it('should create with custom message', () => {
      const exception = new ServiceUnavailableException('Custom service unavailable');

      expect(exception.message).toBe('Custom service unavailable');
      expect(exception.statusCode).toBe(HTTP_STATUS_CODE.SERVICE_UNAVAILABLE);
      expect(exception.errorCode).toBe('SERVICE_UNAVAILABLE');
    });
  });
});
