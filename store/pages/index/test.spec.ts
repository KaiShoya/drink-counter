// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import type { NumberOfDrink } from './type'

// avoid initializing other stores and Nuxt plugins by mocking actions module
vi.mock('./actions', () => ({
  useIndexActions: () => ({}),
}))

const testData1: NumberOfDrink = {
  id: 1,
  name: 'ビール',
  count: 0,
  color: '#ffffff',
  drinkCounterId: 1,
  drinkLabelId: 1,
}
const testData2: NumberOfDrink = {
  id: 2,
  name: 'ハイボール',
  count: 0,
  color: '#ffffff',
  drinkCounterId: 2,
  drinkLabelId: 2,
}

describe('Index Store', () => {
  let store: any

  beforeEach(async () => {
    // creates a fresh pinia and makes it active
    // so it's automatically picked up by any useStore() call
    // without having to pass it to it: `useStore(pinia)`
    setActivePinia(createPinia())

    const { useIndexStore } = await import('./index')
    store = useIndexStore()
    // reset state for isolation
    store.numberOfDrinks.length = 0
    store.numberOfDrinks.push(testData1)
    store.numberOfDrinks.push(testData2)
  })

  it('findNumberOfDrinkByDrinkId()', () => {
    expect(store.findNumberOfDrinkByDrinkId(1)).toStrictEqual(testData1)
    expect(store.findNumberOfDrinkByDrinkId(2)).toStrictEqual(testData2)
  })
})
