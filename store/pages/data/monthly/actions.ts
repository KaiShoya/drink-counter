export const useMonthlyActions = () => {
  const { yearMonth, graphDataTitleBase, graphDataTitle } = useMonthlyState()
  const { computedYearMonth } = useMonthlyGetters()

  const { processIntoYearMonth } = useProcessDate()

  const drinksStore = useDrinksStore()
  const { getDrinksNameArray } = storeToRefs(drinksStore)
  const { fetchDrinks } = drinksStore
  const drinkCountersStore = useDrinkCountersStore()
  const { fetchDrinkCountersPerMonth } = drinkCountersStore
  const { fetchAggregationByDowPerMonth } = useAggregationByDowStore()
  const { fetchSumCountPerMonth } = useAggregationByDrinksStore()

  const prevMonth = () => {
    const newDate = new Date(yearMonth.value)
    newDate.setMonth(newDate.getMonth() - 1)
    yearMonth.value = processIntoYearMonth(newDate)
  }

  const nextMonth = () => {
    const newDate = new Date(yearMonth.value)
    newDate.setMonth(newDate.getMonth() + 1)
    yearMonth.value = processIntoYearMonth(newDate)
  }

  const fetchDrinkCounters = async () => {
    const { year, month } = computedYearMonth.value
    await fetchDrinks()
    await fetchDrinkCountersPerMonth(year, month)
    await fetchSumCountPerMonth(year, month)
    await fetchAggregationByDowPerMonth(year, month)
    graphDataTitle.value = [...graphDataTitleBase, ...getDrinksNameArray.value]
  }

  return {
    prevMonth,
    nextMonth,
    fetchDrinkCounters,
  }
}
