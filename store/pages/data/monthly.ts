import { storeToRefs } from 'pinia'

import { useDrinkCountersStore } from '~/store/data/drinkCounters'
import { useDrinksStore } from '~/store/data/drinks'
import { useAggregationByDowStore } from '~/store/pages/data/components/aggregationByDow'
import { useAggregationByDrinksStore } from '~/store/pages/data/components/aggregationByDrinks'

export const useMonthlyStore = defineStore('monthlyStore', () => {
  const { $i18n } = useNuxtApp()
  const { processIntoYearMonth, formatDrinkCounters } = useProcessDate()
  const drinkCountersStore = useDrinkCountersStore()
  const { drinkCounters } = storeToRefs(drinkCountersStore)
  const { fetchDrinkCountersPerMonth } = drinkCountersStore
  const drinksStore = useDrinksStore()
  const { drinks, getDrinksIdArray, getDrinksNameArray } = storeToRefs(drinksStore)
  const { fetchDrinks } = drinksStore
  const { fetchAggregationByDowPerMonth } = useAggregationByDowStore()
  const { fetchSumCountPerMonth } = useAggregationByDrinksStore()

  const graphDataTitleBase = ['日付', '合計']
  const chartDataTitle = ['Name', 'Count']

  const yearMonth = ref<string>(processIntoYearMonth(new Date()))
  const graphDataTitle = ref<string[]>(graphDataTitleBase)

  const computedYearMonth = computed(() => {
    const [year, month] = yearMonth.value.split('-').map(v => Number(v))
    return { year, month }
  })

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
    const fetchDrinksError = await fetchDrinks()
    if (fetchDrinksError) {
      showDangerToast($i18n.t(fetchDrinksError))
      return
    }
    const fetchDrinkCountersPerMonthError = await fetchDrinkCountersPerMonth(year, month)
    if (fetchDrinkCountersPerMonthError) {
      showDangerToast($i18n.t(fetchDrinkCountersPerMonthError))
      return
    }
    const fetchSumCountPerMonthError = await fetchSumCountPerMonth(year, month)
    if (fetchSumCountPerMonthError) {
      showDangerToast($i18n.t(fetchSumCountPerMonthError))
      return
    }
    const fetchAggregationByDowPerMonthError = await fetchAggregationByDowPerMonth(year, month)
    if (fetchAggregationByDowPerMonthError) {
      showDangerToast($i18n.t(fetchAggregationByDowPerMonthError))
    }
    graphDataTitle.value = [...graphDataTitleBase, ...getDrinksNameArray.value]
  }

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
      ...Object.entries(formatDrinkCounters(drinkCounters.value, getDrinksIdArray.value)).map(([key, value]) => [key as string | Number].concat(value)),
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
    drinks.value.forEach((drink, i) => {
      options.series[i + 1] = { color: drink.color ?? drink.default_color }
    })
    return options
  })

  return {
    yearMonth,
    chartDataTitle,
    prevMonth,
    nextMonth,
    fetchDrinkCounters,
    computeCalendarData,
    computeGraphData,
    computedChartOptions,
  }
})
