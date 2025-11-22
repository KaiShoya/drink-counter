export function useIndexGetters () {
  const { numberOfDrinks, labelsWithDrinks } = useIndexState()

  const findNumberOfDrinkByDrinkId = (drinkId: number) => {
    return numberOfDrinks.value.find(nod => nod.id === drinkId)
  }
  // const findNumberOfDrinkByDrinkCounterId = (drinkCounterId: number) => {
  //   return numberOfDrinks.value.find(nod => nod.drinkCounterId === drinkCounterId)
  // }

  const findNumberOfDrinkByLabels = (labelId: number) => numberOfDrinks.value.filter(nod => nod.drinkLabelId === labelId)

  const findLabelsWithDrinks = (labelId: number) => labelsWithDrinks.value.find(lwd => lwd.id === labelId)

  /**
   * numberOfDrinksのcountの合計値を返却する
   * @returns number 1日の合計数
   */
  const countForDay = () => numberOfDrinks.value.reduce((accumulator, currentValue) => accumulator + currentValue.count, 0)

  return {
    findNumberOfDrinkByDrinkId,
    findNumberOfDrinkByLabels,
    findLabelsWithDrinks,
    countForDay,
  }
}
