export const useAnnualGetters = () => {
  const { year } = useAnnualState()

  const { formatDrinkCounters } = useProcessDate()

  const drinkCountersStore = useDrinkCountersStore()
  const { drinkCounters } = storeToRefs(drinkCountersStore)
  const drinksStore = useDrinksStore()
  const { getDrinksIdArray } = storeToRefs(drinksStore)

  const prevYear = () => year.value--
  const nextYear = () => year.value++

  const computeCalendarData = computed(() => {
    return Object.entries(formatDrinkCounters(drinkCounters.value, getDrinksIdArray.value)).map(([key, value]) => [new Date(key), value[0]])
  })

  return {
    prevYear,
    nextYear,
    computeCalendarData,
  }
}
