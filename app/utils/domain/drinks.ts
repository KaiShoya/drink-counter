import type { DrinkRow } from '~/repositories/drinksRepository'

export const DrinkDomain = {
  /**
   * drink.nameの配列を返却する
   * @param drinks readonly DrinkRow[]
   * @returns string[]
   */
  extractNames(drinks: readonly DrinkRow[]): string[] {
    return drinks.map(({ name }) => name)
  },

  /**
   * drink.idの配列を返却する
   * @param drinks readonly DrinkRow[]
   * @returns number[]
   */
  extractIds(drinks: readonly DrinkRow[]): number[] {
    return drinks.map(({ id }) => id)
  },

  /**
   * 表示状態の飲み物のデータを返却する
   * @param drinks readonly DrinkRow[]
   * @returns DrinkRow[]
   */
  findVisible(drinks: readonly DrinkRow[]): DrinkRow[] {
    return drinks.filter(({ visible }) => visible)
  },

  /**
   * 指定したIDの飲み物データを取得する
   * @param drinks readonly DrinkRow[]
   * @param drinkId number
   * @returns DrinkRow | undefined
   */
  findById(drinks: readonly DrinkRow[], drinkId: number): DrinkRow | undefined {
    return drinks.find(({ id }) => id === drinkId)
  },
} as const
