import { describe, expect, it } from 'vitest'
import { resolveDataPageMode } from './dataPageState'

describe('resolveDataPageMode', () => {
  it('returns loading while fetching', () => {
    const mode = resolveDataPageMode({
      isFetching: true,
      isFetched: false,
      hasError: false,
      totalCount: 0,
    })

    expect(mode).toBe('loading')
  })

  it('returns error when fetch failed', () => {
    const mode = resolveDataPageMode({
      isFetching: false,
      isFetched: true,
      hasError: true,
      totalCount: 10,
    })

    expect(mode).toBe('error')
  })

  it('returns empty when fetched and count is zero', () => {
    const mode = resolveDataPageMode({
      isFetching: false,
      isFetched: true,
      hasError: false,
      totalCount: 0,
    })

    expect(mode).toBe('empty')
  })

  it('returns content when data exists', () => {
    const mode = resolveDataPageMode({
      isFetching: false,
      isFetched: true,
      hasError: false,
      totalCount: 1,
    })

    expect(mode).toBe('content')
  })
})
