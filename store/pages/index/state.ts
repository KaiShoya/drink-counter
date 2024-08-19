const date = ref<string>('')
const numberOfDrinks = ref<NumberOfDrink[]>([])
const labelsWithDrinks = ref<DrinkLabelWithDrinks[]>([])
const drinkCountForDay = ref<number>(0)

export function useIndexState () {
  return {
    date,
    numberOfDrinks,
    labelsWithDrinks,
    drinkCountForDay,
  }
}
