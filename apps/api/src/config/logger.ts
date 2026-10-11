import { env } from './env.js';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLevelPriority = LOG_LEVEL_PRIORITY[env.LOG_LEVEL as LogLevel] ?? 0;

function formatMessage(level: LogLevel, message: string, meta?: unknown): string {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
  if (meta !== undefined) {
    const metaStr = typeof meta === 'object' ? JSON.stringify(meta) : String(meta);
    return `${prefix}: ${message} | ${metaStr}`;
  }
  return `${prefix}: ${message}`;
}

export const logger = {
  debug(message: string, meta?: unknown) {
    if (currentLevelPriority <= LOG_LEVEL_PRIORITY.debug) {
      console.debug(formatMessage('debug', message, meta));
    }
  },
  info(message: string, meta?: unknown) {
    if (currentLevelPriority <= LOG_LEVEL_PRIORITY.info) {
      console.info(formatMessage('info', message, meta));
    }
  },
  warn(message: string, meta?: unknown) {
    if (currentLevelPriority <= LOG_LEVEL_PRIORITY.warn) {
      console.warn(formatMessage('warn', message, meta));
    }
  },
  error(message: string, meta?: unknown) {
    if (currentLevelPriority <= LOG_LEVEL_PRIORITY.error) {
      console.error(formatMessage('error', message, meta));
    }
  },
};
