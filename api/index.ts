import { createApp } from '../apps/api/dist/app.js';
import { connectDatabase } from '../apps/api/dist/config/database.js';

// Trigger database connection asynchronously on cold start if MONGODB_URI is provided
if (process.env.MONGODB_URI) {
  connectDatabase().catch(() => {
    // Gracefully continue in offline mode (portfolio contact form still responds)
  });
}

// Initialize Express application instance
const app = createApp();

/**
 * Vercel Serverless Function entry point.
 * Exports the Express app instance directly using the official Vercel Serverless Function interface.
 */
export default app;
