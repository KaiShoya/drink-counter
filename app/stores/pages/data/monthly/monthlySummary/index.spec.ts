// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// Mock dependent stores and supabase
vi.mock('../../../data/drinks', () => ({
  useDrinksStore: () => ({
    drinks: [{ id: 1, amount: 350, visible: true, drink_label_id: 10 }],
    findDrinksVisible: () => [{ id: 1, amount: 350, visible: true, drink_label_id: 10 }],
    fetchDrinks: vi.fn(),
  }),
}))
vi.mock('../../../data/drinkLabels', () => ({
  useDrinkLabelsStore: () => ({ fetchDrinkLabels: vi.fn() }),
}))
vi.mock('../../../data/userSettings', () => ({
  useUserSettingsStore: () => ({ userSettings: { value: { thresholdForDetectingOverdrinking: 2 } } }),
}))
vi.mock('../../../supabase', () => ({
  useSupabaseStore: () => ({ supabase: {
    from: () => ({
      select: () => ({ order: () => ({ gt: () => ({ gte: () => ({ lt: () => ({ data: [ { id: 1, date: '2025-10-01', drink_id: 1, count: 2 } ], error: null }) }) }) }) }),
    })
  } }),
}))

describe('monthlySummary store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('returns dense calendar and consistent totals', async () => {
    const { useMonthlySummaryStore } = await import('./index')
    const store = useMonthlySummaryStore()
    await store.fetchMonthlySummary({ month: '2025-10', timezone: 'Asia/Tokyo', dayCutoffHour: 5, filters: { visibility: 'visible' } })
    expect(store.data).toBeTruthy()
    const data = store.data!
    expect(data.period.days).toBe(31)
    expect(data.calendar.length).toBe(31)
    const sumCalendar = data.calendar.reduce((a, c) => a + c.count, 0)
    expect(data.kpi.totalDrinks).toBe(sumCalendar)
  })
})
