import type { LogRecord, LogTransport } from './types'

const consoleMethodMap: Record<LogRecord['level'], keyof Console> = {
  debug: 'debug',
  info: 'info',
  warn: 'warn',
  error: 'error',
}

/**
 * ConsoleTransport はブラウザ / Node の console へログを流す最小実装。
 */
export class ConsoleTransport implements LogTransport {
  emit(record: LogRecord) {
    const method = consoleMethodMap[record.level]
    const payload = {
      message: record.message,
      context: record.context,
      error: record.error,
      timestamp: record.timestamp.toISOString(),
    }
    const consoleMethod = console[method] as (...args: unknown[]) => void
    consoleMethod(payload)
  }
}
