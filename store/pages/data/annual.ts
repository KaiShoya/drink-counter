import { storeToRefs } from 'pinia'

import { useSupabaseStore } from '~/store/supabase'
import { useDrinkCountersStore } from '~/store/data/drinkCounters'
import { useDrinksStore } from '~/store/data/drinks'
import { useAggregationByDowTablesStore } from '~/store/pages/data/components/aggregationByDowTables'

export const useAnnualStore = defineStore('annualStore', () => {
  const { $i18n } = useNuxtApp()
  const { supabase } = useSupabaseStore()
  const { formatDrinkCounters } = useProcessDate()
  const drinkCountersStore = useDrinkCountersStore()
  const { drinkCounters } = storeToRefs(drinkCountersStore)
  const { fetchDrinkCountersPerYear } = drinkCountersStore
  const drinksStore = useDrinksStore()
  const { drinks, getDrinksIdArray } = storeToRefs(drinksStore)
  const { fetchDrinks } = drinksStore
  const { fetchAggregationByDowPerYear } = useAggregationByDowTablesStore()

  const chartDataTitle = ['Name', 'Count']
  const sumCountPerYear = ref<Array<{ drink_id: number, count: number }>>([])

  const year = ref<number>((new Date()).getFullYear())
  const minYear = 2023
  const maxYear = (new Date()).getFullYear()

  const prevYear = () => year.value--
  const nextYear = () => year.value++

  const fetchDrinkCounters = async () => {
    const fetchDrinksError = await fetchDrinks()
    if (fetchDrinksError) {
      showDangerToast($i18n.t(fetchDrinksError))
      return
    }
    const fetchDrinkCountersPerYearError = await fetchDrinkCountersPerYear(year.value)
    if (fetchDrinkCountersPerYearError) {
      showDangerToast($i18n.t(fetchDrinkCountersPerYearError))
      return
    }
    const fetchSumCountPerYearError = await fetchSumCountPerYear(year.value)
    if (fetchSumCountPerYearError) {
      showDangerToast($i18n.t(fetchSumCountPerYearError))
    }
    const fetchAggregationByDowPerYearError = await fetchAggregationByDowPerYear(year.value)
    if (fetchAggregationByDowPerYearError) {
      showDangerToast($i18n.t(fetchAggregationByDowPerYearError))
    }
  }

  const fetchSumCountPerYear = async (yearValue: number) => {
    const { data, error } = await supabase.rpc('sum_count_per_year', { year: yearValue })
    if (error) {
      return 'error.500_API_ERROR'
    }
    sumCountPerYear.value = data ?? []
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

  /**
   * テーブル用データ（円グラフでも利用）
   */
  const computedTableData = computed(() => {
    return sumCountPerYear.value.map(
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
    return [chartDataTitle, ...computedTableData.value]
  })

  const computedPieChartOptions = computed(() => {
    return {
      colors: drinks.value.map(drink => drink.color ?? drink.default_color),
    }
  })

  return {
    year,
    minYear,
    maxYear,
    chartDataTitle,
    calendarTitle,
    prevYear,
    nextYear,
    fetchDrinkCounters,
    computeCalendarData,
    computedTableData,
    computedChartData,
    computedPieChartOptions,
  }
})
