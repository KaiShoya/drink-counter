import { ConsoleTransport } from './consoleTransport'
import type { LogLevel, LogRecord, LogTransport, Logger } from './types'

const logLevelSeverity: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

export interface LoggerOptions {
  transports?: LogTransport[]
  defaultContext?: Record<string, unknown>
  level?: LogLevel
}

class AppLogger implements Logger {
  private transports: LogTransport[]
  private defaultContext?: Record<string, unknown>
  private level?: LogLevel

  constructor(options?: LoggerOptions) {
    this.transports = options?.transports?.length ? options.transports : [new ConsoleTransport()]
    this.defaultContext = options?.defaultContext
    this.level = options?.level
  }

  private getMinLogLevel(): LogLevel {
    if (this.level) return this.level
    try {
      const config = useRuntimeConfig()
      return (config.public.logLevel as LogLevel) || 'warn'
    } catch {
      return 'warn'
    }
  }

  private emit(level: LogLevel, message: string, context?: Record<string, unknown>, error?: unknown) {
    const minLevel = this.getMinLogLevel()
    if (logLevelSeverity[level] < logLevelSeverity[minLevel]) {
      return
    }

    const record: LogRecord = {
      level,
      message,
      timestamp: new Date(),
      context: { ...this.defaultContext, ...context },
      error,
    }

    for (const transport of this.transports) {
      transport.emit(record)
    }
  }

  debug(message: string, context?: Record<string, unknown>) {
    this.emit('debug', message, context)
  }

  info(message: string, context?: Record<string, unknown>) {
    this.emit('info', message, context)
  }

  warn(message: string, context?: Record<string, unknown>, error?: unknown) {
    this.emit('warn', message, context, error)
  }

  error(message: string, context?: Record<string, unknown>, error?: unknown) {
    this.emit('error', message, context, error)
  }
}

export const createLogger = (options?: LoggerOptions): Logger => {
  return new AppLogger(options)
}

export const logger = createLogger()
