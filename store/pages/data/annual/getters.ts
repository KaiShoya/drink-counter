import { DrinkDomain } from "~/utils/domain/drinks"

export const useAnnualGetters = () => {
  const { year, drinkCounters } = useAnnualState()

  const { formatDrinkCounters } = useProcessDate()

  const { drinks } = storeToRefs(useDrinksStore())

  const prevYear = () => year.value--
  const nextYear = () => year.value++

  const computeCalendarData = computed(() => {
    return Object.entries(
      formatDrinkCounters(
        drinkCounters.value,
        DrinkDomain.extractIds(drinks.value),
      )
    ).map(
      ([key, value]) => [new Date(key), value[0]]
    )
  })

  return {
    prevYear,
    nextYear,
    computeCalendarData,
  }
}
