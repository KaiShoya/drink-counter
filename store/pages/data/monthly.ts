import { storeToRefs } from 'pinia'

import { useSupabaseStore } from '~/store/supabase'
import { useDrinkCountersStore } from '~/store/data/drinkCounters'
import { useDrinksStore } from '~/store/data/drinks'

export const useMonthlyStore = defineStore('monthlyStore', () => {
  // const { $i18n } = useNuxtApp()
  const { supabase } = useSupabaseStore()
  const { processIntoYearMonth } = useProcessDate()
  const drinkCountersStore = useDrinkCountersStore()
  const { drinkCounters } = storeToRefs(drinkCountersStore)
  const { fetchDrinkCountersPerMonth } = drinkCountersStore
  const drinksStore = useDrinksStore()
  const { drinks, getDrinksIdArray, getDrinksNameArray } = storeToRefs(drinksStore)
  const { fetchDrinks } = drinksStore

  const graphDataTitleBase = ['日付', '合計']
  const chartDataTitle = useState(() => ['Name', 'Count'])

  const yearMonth: Ref<string> = useState(() => processIntoYearMonth(new Date()))
  const graphDataTitle: Ref<Array<string>> = useState(() => graphDataTitleBase)
  const sumCountPerMonth: Ref<Array<{ drink_id: number, count: number }>> = useState(() => [])

  const computedYearMonth = computed(() => {
    const [year, month] = yearMonth.value.split('-').map(v => Number(v))
    return { year, month }
  })

  const fetchSumCountPerMonth = async () => {
    const { year, month } = computedYearMonth.value
    const { data } = await supabase.rpc('sum_count_per_month', { year, month })
    sumCountPerMonth.value = data ?? []
  }

  const fetchDrinkCounters = async () => {
    const { year, month } = computedYearMonth.value
    await fetchDrinks()
    await fetchDrinkCountersPerMonth(year, month)
    await fetchSumCountPerMonth()
    graphDataTitle.value = [...graphDataTitleBase, ...getDrinksNameArray.value]
  }

  /**
   * カレンダー、棒グラフで利用するデータの基礎
   */
  const computeData = computed(() => {
    const data: { [key: string]: Array<number> } = {}

    drinkCounters.value.forEach((drinkCounter) => {
      if (!Object.getOwnPropertyDescriptor(data, drinkCounter.date)) {
        // 配列初期化
        data[drinkCounter.date] = new Array(getDrinksIdArray.value.length + 1)
        data[drinkCounter.date].fill(0)
      }
      data[drinkCounter.date][getDrinksIdArray.value.indexOf(drinkCounter.drink_id) + 1] = drinkCounter.count
      data[drinkCounter.date][0] += drinkCounter.count
    })
    return data
  })

  /**
   * カレンダー用データ
   */
  const computeCalendarData = computed(() => {
    return Object.entries(computeData.value).map(([key, value]) => {
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
      ...Object.entries(computeData.value).map(([key, value]) => [key as string | Number].concat(value)),
    ]
  })

  /**
   * テーブル用データ（円グラフでも利用）
   */
  const computedTableData = computed(() => {
    return sumCountPerMonth.value.map(
      (v: { drink_id: number, count: number }) => [
        drinks.value.find(drink => drink.id === v.drink_id)!.name,
        v.count,
      ],
    )
  })

  /**
   * 円グラフ用データ
   */
  const computedChartData = computed(() => {
    return [chartDataTitle.value, ...computedTableData.value]
  })

  return {
    yearMonth,
    chartDataTitle,
    fetchDrinkCounters,
    computeCalendarData,
    computeGraphData,
    computedTableData,
    computedChartData,
  }
})
