import morgan from 'morgan';
import type { Request } from 'express';
import { logger } from '../config/logger.js';
import { env } from '../config/env.js';

morgan.token('request-id', (req: Request) => req.id || '-');

export const requestLoggerMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms [request-id: :request-id]',
  {
    skip: () => env.NODE_ENV === 'test',
    stream: {
      write: (message: string) => {
        logger.info(message.trim());
      },
    },
  }
);
