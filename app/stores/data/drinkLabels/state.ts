import type { DrinkLabelWithDefaultColor } from "~/repositories/drinkLabelsRepository"

const drinkLabels = ref<DrinkLabelWithDefaultColor[]>([])

export function useDrinkLabelsState () {
  return {
    drinkLabels,
  }
}
