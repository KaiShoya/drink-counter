// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

describe('monthlySummary store', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
    setActivePinia(createPinia())

    vi.stubGlobal('useDrinksStore', () => ({
      drinks: [{ id: 1, amount: 350, visible: true, drink_label_id: 10 }],
      findDrinksVisible: () => [{ id: 1, amount: 350, visible: true, drink_label_id: 10 }],
      fetchDrinks: vi.fn(),
    }))

    vi.stubGlobal('useDrinkLabelsStore', () => ({
      fetchDrinkLabels: vi.fn(),
    }))

    vi.stubGlobal('useUserStore', () => ({
      userSetting: {
        threshold_for_detecting_overdrinking: 2,
        timezone: 'Asia/Tokyo',
        switching_timing: 5,
      },
    }))

    vi.stubGlobal('useNuxtApp', () => ({
      $drinkCountersRepository: {
        fetchByPeriod: vi.fn()
          .mockResolvedValueOnce([{ id: 1, date: '2025-10-01', drink_id: 1, count: 2 }])
          .mockResolvedValueOnce([]),
      },
    }))
  })

  it('returns dense calendar and consistent totals', async () => {
    const { useMonthlySummaryStore } = await import('./index')
    const store = useMonthlySummaryStore()
    await store.fetchMonthlySummary({ month: '2025-10', timezone: 'Asia/Tokyo', dayCutoffHour: 5, filters: { visibility: 'visible' } })
    expect(store.loading).toBe(false)
    expect(store.data || store.error).toBeTruthy()

    if (store.data) {
      const data = store.data
      expect(data.period.days).toBe(31)
      expect(data.calendar.length).toBe(31)
      const sumCalendar = data.calendar.reduce((a, c) => a + c.count, 0)
      expect(data.kpi.totalDrinks).toBe(sumCalendar)
    }
  })
})
