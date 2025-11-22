import { DrinkDomain } from "~/utils/domain/drinks"

export const useMonthlyGetters = () => {
  const { yearMonth, graphDataTitle, drinks, drinkCounters } = useMonthlyState()

  const { formatDrinkCounters } = useProcessDate()

  const computedYearMonth = computed(() => {
    const [year, month] = yearMonth.value.split('-').map(v => Number(v))
    return { year, month }
  })

  /**
   * カレンダー用データ
   */
  const computeCalendarData = computed(() => {
    return Object.entries(
      formatDrinkCounters(
        drinkCounters.value,
        DrinkDomain.extractIds(drinks.value)
      ),
    ).map(([key, value]) => {
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
      ...Object.entries(
        formatDrinkCounters(
          drinkCounters.value,
          DrinkDomain.extractIds(drinks.value),
        )
      ).map(
        ([key, value]) => [key as string | number].concat(value)
      ),
    ]
  })

  const computedChartOptions = computed(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
