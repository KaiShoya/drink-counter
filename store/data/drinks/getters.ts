import type { DrinkRow as Drink } from '~/repositories/drinksRepository'

export function useDrinksGetters () {
  const { drinks } = useDrinksState()
  /**
   * 表示状態の飲み物のデータを返却する
   */
  const findDrinksVisible = () => drinks.value.filter((drink: Drink) => drink.visible)

  /**
   * 指定したIDの飲み物データを取得する
   * @param drinkId number
   * @returns Drink | undefined
   */
  const findDrink = (drinkId: number) => drinks.value.find((d: Drink) => d.id === Number(drinkId))

  /**
   * drink.idの配列を返却する
   */
  const getDrinksIdArray = computed(() => {
    return drinks.value.map(d => d.id)
  })

  /**
   * drink.nameの配列を返却する
   */
  const getDrinksNameArray = computed(() => {
    return drinks.value.map(d => d.name)
  })

  return {
    findDrinksVisible,
    findDrink,
    getDrinksIdArray,
    getDrinksNameArray,
  }
}
