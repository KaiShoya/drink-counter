import type { DrinkLabel } from '~/store/data/types/drinkLabel'

export interface NumberOfDrink {
  id: number
  name: string
  count: number
  color: string
  drinkCounterId: number
  drinkLabelId: number | null
}

export interface DrinkLabelWithDrinks extends DrinkLabel {
  drinks: Array<NumberOfDrink>
  currentDrink: NumberOfDrink | null
}
