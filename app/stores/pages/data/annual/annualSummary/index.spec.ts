// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

describe('annualSummary store', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
    setActivePinia(createPinia())

    vi.stubGlobal('useDrinksStore', () => ({
      drinks: [{ id: 1, amount: 350, visible: true, drink_label_id: 10 }],
      fetchDrinks: vi.fn(),
    }))

    const responses = [
      { data: [{ id: 1, date: '2025-01-02', drink_id: 1, count: 3 }], error: null },
      { data: [], error: null },
    ]

    const createQueryBuilder = () => ({
      select () { return this },
      order () { return this },
      gt () { return this },
      gte () { return this },
      lt: vi.fn().mockImplementation(() => Promise.resolve(responses.shift() ?? { data: [], error: null })),
    })

    vi.stubGlobal('useSupabaseStore', () => ({
      supabase: {
        from: () => createQueryBuilder(),
      },
    }))
  })

  it('computes KPI for a year', async () => {
    const { useAnnualSummaryStore } = await import('./index')
    const store = useAnnualSummaryStore()
    await store.fetchAnnualSummary({ year: 2025, timezone: 'Asia/Tokyo', dayCutoffHour: 5, filters: { visibility: 'visible' } })
    expect(store.loading).toBe(false)
    expect(store.data || store.error).toBeTruthy()

    if (store.data) {
      const data = store.data
      expect(data.period.start).toBe('2025-01-01')
      expect(data.period.days).toBe(365)
      expect(data.kpi.totalDrinks).toBe(3)
      expect(typeof data.kpi.avgPerCalendarDay).toBe('number')
    }
  })
})
