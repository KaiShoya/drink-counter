const drinkLabels = ref<DrinkLabel[]>([])

export function useDrinkLabelsState () {
  return {
    drinkLabels,
  }
}
