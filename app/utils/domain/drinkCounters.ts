import type { DrinkCounterRow } from '../api/drinkCountersRepository'

export const DrinkCounterDomain = {
  /**
   * drinkCountersから指定したidのレコードを取得する
   * @param drinkCounters readonly DrinkCounterRow[]
   * @param drinkCounterId number
   * @returns DrinkCounterRow | undefined
   */
  findById(drinkCounters: readonly DrinkCounterRow[], drinkCounterId: number): DrinkCounterRow | undefined {
    return drinkCounters.find(({ id }) => id === drinkCounterId)
  },

  /**
   * drinkCountersから指定したdrink.idのレコードを取得する
   * @param drinkCounters readonly DrinkCounterRow[]
   * @param drinkId number
   * @returns DrinkCounterRow | undefined
   */
  findByDrinkId(drinkCounters: readonly DrinkCounterRow[], drinkId: number): DrinkCounterRow | undefined {
    return drinkCounters.find(({ drink_id }) => drink_id === drinkId)
  },
} as const
