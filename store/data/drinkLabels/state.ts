import type { DrinkLabelWithDefaultColor } from "~/utils/api/drinkLabelsRepository"

const drinkLabels = ref<DrinkLabelWithDefaultColor[]>([])

export function useDrinkLabelsState () {
  return {
    drinkLabels,
  }
}
