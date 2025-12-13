import type { DrinkCounterRow } from '~/app/repositories/drinkCountersRepository'

const date = ref<string>('')
const numberOfDrinks = ref<NumberOfDrink[]>([])
const labelsWithDrinks = ref<DrinkLabelWithDrinks[]>([])
const drinkCountForDay = ref<number>(0)
const drinkCounters = ref<DrinkCounterRow[]>([])

export function useIndexState () {
  return {
    date,
    numberOfDrinks,
    labelsWithDrinks,
    drinkCountForDay,
    drinkCounters,
  }
}
