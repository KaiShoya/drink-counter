// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'

import { createLogger } from './Logger'
import type { LogRecord, LogTransport } from './types'

class MockTransport implements LogTransport {
  emit = vi.fn<(record: LogRecord) => void>()
}

describe('logger utility', () => {
  it('routes log messages through provided transport', () => {
    const transport = new MockTransport()
    const logger = createLogger({ transports: [transport] })

    logger.info('hello world', { feature: 'logging' })

    expect(transport.emit).toHaveBeenCalledTimes(1)
    expect(transport.emit).toHaveBeenCalledWith(
      expect.objectContaining({
        level: 'info',
        message: 'hello world',
        context: { feature: 'logging' },
        timestamp: expect.any(Date),
      }),
    )
  })

  it('includes error payloads when provided', () => {
    const transport = new MockTransport()
    const logger = createLogger({ transports: [transport], defaultContext: { app: 'drink-counter' } })
    const error = new Error('boom')

    logger.error('failed', { module: 'test' }, error)

    expect(transport.emit).toHaveBeenCalledWith(
      expect.objectContaining({
        level: 'error',
        message: 'failed',
        context: { app: 'drink-counter', module: 'test' },
        error,
      }),
    )
  })

  it('filters logs below configured level', () => {
    const transport = new MockTransport()
    const logger = createLogger({ transports: [transport], level: 'warn' })

    logger.info('should be ignored')
    logger.debug('should be ignored')
    logger.warn('should be emitted')
    logger.error('should be emitted')

    expect(transport.emit).toHaveBeenCalledTimes(2)
    expect(transport.emit).toHaveBeenCalledWith(expect.objectContaining({ level: 'warn' }))
    expect(transport.emit).toHaveBeenCalledWith(expect.objectContaining({ level: 'error' }))
  })
})
