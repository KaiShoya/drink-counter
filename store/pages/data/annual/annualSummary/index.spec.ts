// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('../../../data/drinks', () => ({
  useDrinksStore: () => ({
    drinks: [{ id: 1, amount: 350, visible: true, drink_label_id: 10 }],
    fetchDrinks: vi.fn(),
  }),
}))
vi.mock('../../../data/userSettings', () => ({
  useUserSettingsStore: () => ({ userSettings: { value: { thresholdForDetectingOverdrinking: 2 } } }),
}))
vi.mock('../../../supabase', () => ({
  useSupabaseStore: () => ({ supabase: {
    from: () => ({
      select: () => ({ order: () => ({ gt: () => ({ gte: () => ({ lt: () => ({ data: [ { id: 1, date: '2025-01-02', drink_id: 1, count: 3 } ], error: null }) }) }) }) }),
    })
  } }),
}))

describe('annualSummary store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('computes KPI for a year', async () => {
    const { useAnnualSummaryStore } = await import('./index')
    const store = useAnnualSummaryStore()
    await store.fetchAnnualSummary({ year: 2025, timezone: 'Asia/Tokyo', dayCutoffHour: 5, filters: { visibility: 'visible' } })
    expect(store.data).toBeTruthy()
    const data = store.data!
    expect(data.period.start).toBe('2025-01-01')
    expect(data.period.days).toBe(365)
    expect(data.kpi.totalDrinks).toBe(3)
    expect(typeof data.kpi.avgPerCalendarDay).toBe('number')
  })
})
