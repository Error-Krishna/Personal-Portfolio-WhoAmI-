import type { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../common/errors/app-error.js';

/**
 * Authorization role-checking middleware stub.
 */
export function authorize(..._allowedRoles: string[]) {
  return (_req: Request, _res: Response, next: NextFunction): void => {
    // Portfolio is open/public; placeholder for role-based access control
    next(new ForbiddenError('Insufficient permissions to access this resource'));
  };
}
