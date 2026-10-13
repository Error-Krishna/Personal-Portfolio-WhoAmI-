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

  // CORS configuration (supports comma-separated origins and Vercel preview domains)
  const configuredOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim());

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, server-to-server, or same-origin)
        if (!origin) return callback(null, true);

        const isAllowed =
          configuredOrigins.includes(origin) ||
          configuredOrigins.includes('*') ||
          /^https:\/\/[a-zA-Z0-9_-]+\.vercel\.app$/.test(origin);

        if (isAllowed) {
          callback(null, true);
        } else {
          callback(new Error(`Origin ${origin} not allowed by CORS`));
        }
      },
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
