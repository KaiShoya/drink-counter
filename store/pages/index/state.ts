import type { DrinkCounterRow } from '~/utils/api/drinkCountersRepository'
import type { DrinkRow } from '~/utils/api/drinksRepository'
import type { DrinkLabelWithDefaultColor } from '~/utils/api/drinkLabelsRepository'

const date = ref<string>('')
const numberOfDrinks = ref<NumberOfDrink[]>([])
const labelsWithDrinks = ref<DrinkLabelWithDrinks[]>([])
const drinkCountForDay = ref<number>(0)
const drinks = ref<DrinkRow[]>([])
const drinkCounters = ref<DrinkCounterRow[]>([])
const drinkLabels = ref<DrinkLabelWithDefaultColor[]>([])

export function useIndexState () {
  return {
    date,
    numberOfDrinks,
    labelsWithDrinks,
    drinkCountForDay,
    drinks,
    drinkCounters,
    drinkLabels,
  }
}
