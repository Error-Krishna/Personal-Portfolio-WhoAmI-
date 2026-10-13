import type { IncomingMessage, ServerResponse } from 'http';
import { createApp } from '../apps/api/dist/app.js';
import { connectDatabase } from '../apps/api/dist/config/database.js';

// Initialize Express application instance
const app = createApp();

let isConnected = false;

/**
 * Vercel Serverless Function entry point.
 * Dispatches incoming HTTP requests to the existing Express app instance.
 */
export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  // Connect database on cold start if MONGODB_URI is provided
  if (!isConnected && process.env.MONGODB_URI) {
    try {
      await connectDatabase();
      isConnected = true;
    } catch {
      // Gracefully continue in offline mode (portfolio contact form still responds)
    }
  }

  // Delegate request handling to Express
  app(req, res);
}
