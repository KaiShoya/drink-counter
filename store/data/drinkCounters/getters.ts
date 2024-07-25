export function useDrinkCountersGetters () {
  const { drinkCounters } = useDrinkCountersState()

  /**
   * drinkCountersから指定したidのレコードを取得する
   * @param id drinkCounter.id
   * @returns Drink
   * Counter | undefined
   */
  const findDrinkCountersById = (id: number) => {
    return drinkCounters.value.find(dc => dc.id === id)
  }

  /**
   * drinkCountersから指定したdrink.idのレコードを取得する
   * @param id drink.id
   * @returns DrinkCounter | undefined
   */
  const findDrinkCountersByDrinkId = (id: number) => {
    return drinkCounters.value.find((dc: any) => dc.drink_id === id)
  }

  return {
    findDrinkCountersById,
    findDrinkCountersByDrinkId,
  }
}
