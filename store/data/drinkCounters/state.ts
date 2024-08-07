const drinkCounters = ref<DrinkCounter[]>([])

export function useDrinkCountersState () {
  return {
    drinkCounters,
  }
}
