/**
 * Centralized Logger Utility
 *
 * Usage:
 *   import { logger } from '@/app/utils/logger';
 *   logger.info('User logged in');
 *   logger.warn('API slow response');
 *   logger.error('Failed to save habit', error);
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LoggerConfig {
  enabled: boolean;
  minLevel: LogLevel;
  prefix: string;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const config: LoggerConfig = {
  enabled:
    process.env.NODE_ENV !== "production" ||
    process.env.NEXT_PUBLIC_DEBUG === "true",
  minLevel: process.env.NODE_ENV === "production" ? "warn" : "debug",
  prefix: "[HabitSpark]",
};

function shouldLog(level: LogLevel): boolean {
  return config.enabled && LOG_LEVELS[level] >= LOG_LEVELS[config.minLevel];
}

function formatMessage(level: LogLevel, message: string): string {
  const timestamp = new Date().toISOString().split("T")[1].split(".")[0];
  const levelLabel = level.toUpperCase().padEnd(5);
  return `${config.prefix} ${timestamp} ${levelLabel} ${message}`;
}

export const logger = {
  debug: (message: string, ...args: unknown[]) => {
    if (shouldLog("debug")) {
      console.debug(formatMessage("debug", message), ...args);
    }
  },

  info: (message: string, ...args: unknown[]) => {
    if (shouldLog("info")) {
      console.info(formatMessage("info", message), ...args);
    }
  },

  warn: (message: string, ...args: unknown[]) => {
    if (shouldLog("warn")) {
      console.warn(formatMessage("warn", message), ...args);
    }
  },

  error: (message: string, error?: unknown, ...args: unknown[]) => {
    if (shouldLog("error")) {
      console.error(formatMessage("error", message), error, ...args);

      // In production, you could send to error tracking service here
      // Example: Sentry.captureException(error);
    }
  },

  // Group related logs
  group: (label: string) => {
    if (config.enabled) {
      console.group(`${config.prefix} ${label}`);
    }
  },

  groupEnd: () => {
    if (config.enabled) {
      console.groupEnd();
    }
  },

  // Performance timing
  time: (label: string) => {
    if (config.enabled) {
      console.time(`${config.prefix} ${label}`);
    }
  },

  timeEnd: (label: string) => {
    if (config.enabled) {
      console.timeEnd(`${config.prefix} ${label}`);
    }
  },

  // Table for structured data
  table: (data: unknown) => {
    if (config.enabled) {
      console.table(data);
    }
  },
};

export default logger;
