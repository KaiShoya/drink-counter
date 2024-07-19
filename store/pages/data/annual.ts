export const useAnnualStore = defineStore('annualStore', () => {
  const { showLoading, hideLoading } = useAppStore()
  const { formatDrinkCounters } = useProcessDate()
  const drinkCountersStore = useDrinkCountersStore()
  const { drinkCounters } = storeToRefs(drinkCountersStore)
  const { fetchDrinkCountersPerYear } = drinkCountersStore
  const drinksStore = useDrinksStore()
  const { getDrinksIdArray } = storeToRefs(drinksStore)
  const { fetchDrinks } = drinksStore
  const { fetchAggregationByDowPerYear } = useAggregationByDowStore()
  const { fetchSumCountPerYear } = useAggregationByDrinksStore()

  const year = ref<number>((new Date()).getFullYear())

  const prevYear = () => year.value--
  const nextYear = () => year.value++

  const fetchDrinkCounters = async () => {
    showLoading()
    await fetchDrinks()
    await fetchDrinkCountersPerYear(year.value)
    await fetchSumCountPerYear(year.value)
    await fetchAggregationByDowPerYear(year.value)
    hideLoading()
  }

  /**
   * カレンダー用データ
   */
  const calendarTitle = ref<Array<{ type: string, id: string }>>([
    {
      type: 'date',
      id: 'Date',
    },
    {
      type: 'number',
      id: 'Count',
    },
  ])
  const computeCalendarData = computed(() => {
    return Object.entries(formatDrinkCounters(drinkCounters.value, getDrinksIdArray.value)).map(([key, value]) => [new Date(key), value[0]])
  })

  return {
    year,
    calendarTitle,
    prevYear,
    nextYear,
    fetchDrinkCounters,
    computeCalendarData,
  }
})
