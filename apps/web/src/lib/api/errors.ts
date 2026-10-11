import type { ApiErrorDetail, ApiErrorResponse } from '@portfolio/contracts';

export class ApiClientError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details: ApiErrorDetail[];
  public readonly requestId?: string;
  public readonly timestamp: string;

  constructor(
    message: string,
    code: string = 'UNKNOWN_ERROR',
    statusCode: number = 500,
    details: ApiErrorDetail[] = [],
    requestId?: string,
    timestamp: string = new Date().toISOString()
  ) {
    super(message);
    this.name = 'ApiClientError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.requestId = requestId;
    this.timestamp = timestamp;
  }

  static fromApiResponse(payload: ApiErrorResponse): ApiClientError {
    return new ApiClientError(
      payload.error.message,
      payload.error.code,
      payload.error.statusCode,
      payload.error.details || [],
      payload.error.requestId,
      payload.error.timestamp
    );
  }

  static networkError(message: string = 'Network connection failed. Please check your internet.'): ApiClientError {
    return new ApiClientError(message, 'NETWORK_ERROR', 0);
  }

  static timeoutError(message: string = 'Request timed out. Please try again.'): ApiClientError {
    return new ApiClientError(message, 'TIMEOUT_ERROR', 408);
  }
}

/**
 * Extracts a user-friendly error message from any caught error.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiClientError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Converts ApiClientError details into a dictionary of field -> message.
 */
export function getFieldErrors(error: unknown): Record<string, string> {
  const result: Record<string, string> = {};
  if (error instanceof ApiClientError && error.details.length > 0) {
    for (const detail of error.details) {
      if (detail.field) {
        result[detail.field] = detail.message;
      }
    }
  }
  return result;
}
