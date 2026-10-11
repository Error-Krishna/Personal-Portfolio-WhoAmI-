import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { requestIdMiddleware } from './common/middleware/request-id.js';
import { requestLoggerMiddleware } from './middleware/request-logger.js';
import { globalRateLimiter } from './middleware/rate-limit.js';
import { notFoundMiddleware } from './common/middleware/not-found.js';
import { errorHandlerMiddleware } from './common/middleware/error-handler.js';
import { apiRoutes } from './routes/index.js';

export function createApp(): Express {
  const app = express();

  // Security headers
  app.use(helmet());

  // CORS configuration
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
    })
  );

  // Request ID tracking
  app.use(requestIdMiddleware);

  // Body parsers
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // HTTP request logging
  app.use(requestLoggerMiddleware);

  // Global rate limiter
  app.use(globalRateLimiter);

  // Mount API routes
  app.use(env.API_PREFIX, apiRoutes);

  // 404 handler for unknown routes
  app.use(notFoundMiddleware);

  // Centralized error handler
  app.use(errorHandlerMiddleware);

  return app;
}
