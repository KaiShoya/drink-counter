import type { DrinkLabelWithDefaultColor } from '../api/drinkLabelsRepository'

export const DrinkLabelDomain = {
  /**
   * 表示状態のラベルデータを返却する
   * @param drinkLabels readonly DrinkLabelWithDefaultColor[]
   * @returns DrinkLabelWithDefaultColor[]
   */
  findVisible(drinkLabels: readonly DrinkLabelWithDefaultColor[]) {
    return drinkLabels.filter(({ visible }) => visible)
  },

  /**
   * 指定したIDのラベルデータを取得する
   * @param drinkLabels readonly DrinkLabelWithDefaultColor[]
   * @param drinkLabelId number
   * @returns DrinkLabelWithDefaultColor | undefined
   */
  findById(drinkLabels: readonly DrinkLabelWithDefaultColor[], drinkLabelId: number): DrinkLabelWithDefaultColor | undefined {
    return drinkLabels.find(({ id }) => id === drinkLabelId)
  },
} as const
