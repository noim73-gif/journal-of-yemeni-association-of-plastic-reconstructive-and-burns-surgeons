/**
 * Safe logging utility that only outputs detailed errors in development.
 * In production, sensitive error details are suppressed to prevent information leakage.
 */

const isDev = import.meta.env.DEV;

export const logger = {
  error: (message: string, ...args: unknown[]) => {
    if (isDev) {
      console.error(message, ...args);
    }
    // In production, log only the sanitized message (no error objects)
    // This prevents leaking database schemas, user IDs, file paths, etc.
  },
  warn: (message: string, ...args: unknown[]) => {
    if (isDev) {
      console.warn(message, ...args);
    }
  },
  info: (message: string, ...args: unknown[]) => {
    if (isDev) {
      console.info(message, ...args);
    }
  },
};
