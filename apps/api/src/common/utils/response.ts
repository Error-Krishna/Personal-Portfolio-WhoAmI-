import type { Response } from 'express';
import type { ApiSuccessResponse, ApiErrorResponse, ApiErrorDetail } from '@portfolio/contracts';
import { HttpStatus, type HttpStatusCode } from '../constants/http-status.js';

export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode: HttpStatusCode = HttpStatus.OK,
  meta?: Record<string, unknown>
): Response {
  const payload: ApiSuccessResponse<T> = {
    success: true,
    data,
    ...(meta ? { meta } : {}),
  };
  return res.status(statusCode).json(payload);
}

export function sendError(
  res: Response,
  statusCode: HttpStatusCode,
  code: string,
  message: string,
  requestId?: string,
  details?: ApiErrorDetail[],
  stack?: string
): Response {
  const payload: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      statusCode,
      details,
      requestId,
      timestamp: new Date().toISOString(),
      ...(stack ? { stack } : {}),
    },
  };
  return res.status(statusCode).json(payload);
}
