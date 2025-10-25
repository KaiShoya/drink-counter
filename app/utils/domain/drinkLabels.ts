import type { DrinkLabelRow } from '../api/drinkLabelsRepository'

export const DrinkLabelDomain = {
  /**
   * 表示状態のラベルデータを返却する
   * @param drinkLabels readonly DrinkLabelRow[]
   * @returns DrinkLabelRow[]
   */
  findVisible(drinkLabels: readonly DrinkLabelRow[]) {
    return drinkLabels.filter(({ visible }) => visible)
  },

  /**
   * 指定したIDのラベルデータを取得する
   * @param drinkLabels readonly DrinkLabelRow[]
   * @param drinkLabelId number
   * @returns DrinkLabelRow | undefined
   */
  findById(drinkLabels: readonly DrinkLabelRow[], drinkLabelId: number): DrinkLabelRow | undefined {
    return drinkLabels.find(({ id }) => id === drinkLabelId)
  },
} as const
