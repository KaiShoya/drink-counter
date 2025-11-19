export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogRecord {
  level: LogLevel
  message: string
  timestamp: Date
  context?: Record<string, unknown>
  error?: unknown
}

export interface LogTransport {
  emit: (record: LogRecord) => void
}

export interface Logger {
  debug: (message: string, context?: Record<string, unknown>) => void
  info: (message: string, context?: Record<string, unknown>) => void
  warn: (message: string, context?: Record<string, unknown>, error?: unknown) => void
  error: (message: string, context?: Record<string, unknown>, error?: unknown) => void
}
