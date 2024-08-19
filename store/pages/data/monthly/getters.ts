export const useMonthlyGetters = () => {
  const { yearMonth, graphDataTitle } = useMonthlyState()

  const { formatDrinkCounters } = useProcessDate()

  const drinksStore = useDrinksStore()
  const { drinks, getDrinksIdArray } = storeToRefs(drinksStore)
  const drinkCountersStore = useDrinkCountersStore()
  const { drinkCounters } = storeToRefs(drinkCountersStore)

  const computedYearMonth = computed(() => {
    const [year, month] = yearMonth.value.split('-').map(v => Number(v))
    return { year, month }
  })

  /**
   * カレンダー用データ
   */
  const computeCalendarData = computed(() => {
    return Object.entries(formatDrinkCounters(drinkCounters.value, getDrinksIdArray.value)).map(([key, value]) => {
      return {
        date: key,
        count: value[0],
      }
    })
  })

  /**
   * 棒グラフ用データ
   */
  const computeGraphData = computed(() => {
    return [
      graphDataTitle.value,
      ...Object.entries(formatDrinkCounters(drinkCounters.value, getDrinksIdArray.value)).map(([key, value]) => [key as string | number].concat(value)),
    ]
  })

  const computedChartOptions = computed(() => {
    const options: any = {
      seriesType: 'bars',
      legend: { position: 'bottom' },
      series: {
        0: { type: 'line' },
      },
    }
    for (const [i, drink] of Object.entries(drinks.value)) {
      options.series[i + 1] = { color: drink.color ?? drink.default_color }
    }
    return options
  })

  return {
    computedYearMonth,
    computeCalendarData,
    computeGraphData,
    computedChartOptions,
  }
}
