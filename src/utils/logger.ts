/**
 * Logger utility with environment-aware logging
 * Only logs in development mode to avoid performance issues and information leaks
 */

type LogLevel = 'log' | 'warn' | 'error' | 'info' | 'debug';

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  /**
   * Log informational messages (only in development)
   */
  log: (...args: unknown[]): void => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  /**
   * Log debug messages (only in development)
   */
  debug: (...args: unknown[]): void => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },

  /**
   * Log info messages (only in development)
   */
  info: (...args: unknown[]): void => {
    if (isDevelopment) {
      console.info(...args);
    }
  },

  /**
   * Log warning messages (only in development)
   */
  warn: (...args: unknown[]): void => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  /**
   * Log error messages (always logged, even in production)
   */
  error: (...args: unknown[]): void => {
    console.error(...args);
    // TODO: In production, send to error tracking service (Sentry, etc.)
  },

  /**
   * Group related logs together (only in development)
   */
  group: (label: string, collapsed = false): void => {
    if (isDevelopment) {
      if (collapsed) {
        console.groupCollapsed(label);
      } else {
        console.group(label);
      }
    }
  },

  /**
   * End a log group (only in development)
   */
  groupEnd: (): void => {
    if (isDevelopment) {
      console.groupEnd();
    }
  },

  /**
   * Log with a specific level
   */
  logWithLevel: (level: LogLevel, ...args: unknown[]): void => {
    switch (level) {
      case 'log':
        logger.log(...args);
        break;
      case 'debug':
        logger.debug(...args);
        break;
      case 'info':
        logger.info(...args);
        break;
      case 'warn':
        logger.warn(...args);
        break;
      case 'error':
        logger.error(...args);
        break;
    }
  },
};

export default logger;

