import { ErrorCode, type ErrorCodeType, type ApiErrorDetail } from '@portfolio/contracts';
import { HttpStatus, type HttpStatusCode } from '../constants/http-status.js';

export class AppError extends Error {
  public readonly statusCode: HttpStatusCode;
  public readonly code: ErrorCodeType;
  public readonly details?: ApiErrorDetail[];
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: HttpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR,
    code: ErrorCodeType = ErrorCode.INTERNAL_SERVER_ERROR,
    details?: ApiErrorDetail[],
    isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = 'Bad request', details?: ApiErrorDetail[]) {
    super(message, HttpStatus.BAD_REQUEST, ErrorCode.BAD_REQUEST, details);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed', details?: ApiErrorDetail[]) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY, ErrorCode.VALIDATION_ERROR, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Authentication required', details?: ApiErrorDetail[]) {
    super(message, HttpStatus.UNAUTHORIZED, ErrorCode.UNAUTHORIZED, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Access denied', details?: ApiErrorDetail[]) {
    super(message, HttpStatus.FORBIDDEN, ErrorCode.FORBIDDEN, details);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND);
  }
}

export class MethodNotAllowedError extends AppError {
  constructor(message: string = 'Method not allowed') {
    super(message, HttpStatus.METHOD_NOT_ALLOWED, ErrorCode.METHOD_NOT_ALLOWED);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Conflict detected', details?: ApiErrorDetail[]) {
    super(message, HttpStatus.CONFLICT, ErrorCode.CONFLICT, details);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests, please try again later') {
    super(message, HttpStatus.TOO_MANY_REQUESTS, ErrorCode.RATE_LIMIT_EXCEEDED);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'An unexpected internal server error occurred') {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_SERVER_ERROR, undefined, false);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed') {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, ErrorCode.DATABASE_ERROR, undefined, false);
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message: string = 'Service temporarily unavailable') {
    super(message, HttpStatus.SERVICE_UNAVAILABLE, ErrorCode.SERVICE_UNAVAILABLE);
  }
}
