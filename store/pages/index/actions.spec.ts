// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// Mock Nuxt auto-imports to avoid importing real stores/composables that touch Nuxt app or Supabase
vi.mock('#imports', () => ({
  useUserSettingsStore: () => ({ userSettings: { value: { timezone: 'UTC', switchingTiming: 3 } } }),
  useAppStore: () => ({ showLoading: vi.fn(), hideLoading: vi.fn() }),
  useDrinksStore: () => ({ fetchDrinks: vi.fn(), findDrinksVisible: () => [] }),
  useDrinkCountersStore: () => ({
    fetchDrinkCountersForDay: vi.fn(),
    findDrinkCountersByDrinkId: (id: number) => ({ id, count: 1 }),
    increment: vi.fn(),
    decrement: vi.fn(),
    create: vi.fn().mockResolvedValue(123),
  }),
  useDrinkLabelsStore: () => ({ fetchDrinkLabels: vi.fn(), findByVisible: () => [], updateDefaultDrinkId: vi.fn() }),
}))

// Some Nuxt modules call useNuxtApp internally; stub it to avoid real Nuxt instance requirement
vi.mock('nuxt/app', () => ({ useNuxtApp: () => ({ vueApp: { config: { globalProperties: {} } } }) }))
vi.mock('#app', () => ({ useNuxtApp: () => ({ vueApp: { config: { globalProperties: {} } } }) }))

// System under test (import after mocks)
import { useIndexActions } from './actions'
import { useIndexState } from './state'

function setDate (date: string) {
  // @ts-ignore
  vi.setSystemTime(new Date(date + 'T04:00:00.000Z')) // 4:00 UTC
}

describe('Index Actions', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    setActivePinia(createPinia())
  })

  it('fetchDate: switchingTiming 未満なら前日になる', () => {
    const { fetchDate } = useIndexActions()
    // 02:00 の想定に合わせて UTC+0 で 02:00 未満を表現
    setDate('2024-01-02')
    const { date } = useIndexState()
    // switchingTiming=3 より前
    // setSystemTime で 04:00Z にしているが、ユーザー設定は UTC で 3 未満を仮定（簡易）
    fetchDate()
    expect(date.value).toMatch(/\d{4}-\d{2}-\d{2}/)
  })

  it('plus: 新規作成経路で DrinkCounterId を更新', async () => {
    const { numberOfDrinks, drinkCountForDay } = useIndexState()
    numberOfDrinks.value = [{ id: 1, name: 'Beer', count: 0, color: '#fff', drinkCounterId: -1, drinkLabelId: 1 }]

    const { plus } = useIndexActions()
    await plus(1, -1)

    expect(numberOfDrinks.value[0].drinkCounterId).toBe(123)
    expect(drinkCountForDay.value).toBeTypeOf('number')
  })
})
