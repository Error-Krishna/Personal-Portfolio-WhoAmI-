import type { Request, Response } from 'express';
import { getDatabaseStatus } from '../../config/database.js';
import { sendSuccess } from '../../common/utils/response.js';
import type { HealthCheckResponse } from '@portfolio/contracts';

export class HealthController {
  public static getHealth(_req: Request, res: Response): void {
    const dbStatus = getDatabaseStatus();

    const data: HealthCheckResponse = {
      status: dbStatus === 'disconnected' ? 'degraded' : 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: {
          status: dbStatus,
        },
      },
    };

    sendSuccess(res, data);
  }
}
