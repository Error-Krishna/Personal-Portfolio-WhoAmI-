import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error.js';
import { ErrorCode, type ApiErrorDetail } from '@portfolio/contracts';
import { HttpStatus, type HttpStatusCode } from '../constants/http-status.js';
import { env } from '../../config/env.js';
import { logger } from '../../config/logger.js';
import { sendError } from '../utils/response.js';

interface MongooseErrorLike {
  name?: string;
  code?: number;
  path?: string;
  value?: unknown;
  errors?: Record<string, { message: string; path: string }>;
  keyValue?: Record<string, unknown>;
}

export function errorHandlerMiddleware(
  err: Error | AppError | MongooseErrorLike,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  const requestId = req.id;
  const isDev = env.NODE_ENV === 'development';

  // 1. Handled Operational AppError
  if (err instanceof AppError) {
    if (!err.isOperational) {
      logger.error(`[AppError:NonOperational] ${err.message}`, {
        code: err.code,
        requestId,
        stack: err.stack,
      });
    }

    sendError(
      res,
      err.statusCode,
      err.code,
      err.message,
      requestId,
      err.details,
      isDev ? err.stack : undefined
    );
    return;
  }

  // 2. SyntaxError (e.g. Malformed JSON payload)
  if (err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err) {
    logger.warn(`[SyntaxError:MalformedJSON] ${err.message}`, { requestId });
    sendError(
      res,
      HttpStatus.BAD_REQUEST,
      ErrorCode.BAD_REQUEST,
      'Malformed JSON payload in request body',
      requestId
    );
    return;
  }

  // 3. Mongoose CastError (e.g. Invalid ObjectId)
  if (err.name === 'CastError') {
    const castErr = err as MongooseErrorLike;
    const message = `Invalid format for field '${castErr.path}': ${String(castErr.value)}`;
    logger.warn(`[Mongoose:CastError] ${message}`, { requestId });
    sendError(res, HttpStatus.BAD_REQUEST, ErrorCode.BAD_REQUEST, message, requestId);
    return;
  }

  // 4. Mongoose ValidationError
  if (err.name === 'ValidationError' && 'errors' in err && err.errors) {
    const mongoValErr = err as MongooseErrorLike;
    const details: ApiErrorDetail[] = Object.values(mongoValErr.errors || {}).map((item) => ({
      field: item.path,
      message: item.message,
    }));
    logger.warn(`[Mongoose:ValidationError] Validation failed`, { requestId, details });
    sendError(
      res,
      HttpStatus.UNPROCESSABLE_ENTITY,
      ErrorCode.VALIDATION_ERROR,
      'Database schema validation failed',
      requestId,
      details
    );
    return;
  }

  // 5. MongoDB Duplicate Key Error (E11000)
  if (err.name === 'MongoServerError' && (err as MongooseErrorLike).code === 11000) {
    const mongoErr = err as MongooseErrorLike;
    const duplicateFields = mongoErr.keyValue ? Object.keys(mongoErr.keyValue).join(', ') : 'field';
    const message = `Duplicate value error for field(s): ${duplicateFields}`;
    logger.warn(`[MongoDB:DuplicateKey] ${message}`, { requestId });
    sendError(res, HttpStatus.CONFLICT, ErrorCode.CONFLICT, message, requestId);
    return;
  }

  // 6. Generic Unhandled Error
  const genericError = err as Error;
  logger.error(`[UnhandledError] ${genericError.message}`, {
    requestId,
    stack: genericError.stack,
    url: req.originalUrl,
    method: req.method,
  });

  const statusCode: HttpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  const message = isDev
    ? genericError.message || 'An unexpected internal server error occurred'
    : 'An unexpected internal server error occurred';

  sendError(
    res,
    statusCode,
    ErrorCode.INTERNAL_SERVER_ERROR,
    message,
    requestId,
    undefined,
    isDev ? genericError.stack : undefined
  );
}
