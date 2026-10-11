import type { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../common/errors/app-error.js';

/**
 * Authentication middleware stub.
 * Note: Portfolio public endpoints do not require authentication.
 * If authentication is needed for future admin features, implement JWT verification here.
 */
export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(new UnauthorizedError('Authorization header required'));
  }
  next();
}
