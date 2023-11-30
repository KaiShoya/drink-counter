import { storeToRefs } from 'pinia'

import { useSupabaseStore } from '~/store/supabase'
import { useDrinkCountersStore } from '~/store/data/drinkCounters'
import { useDrinksStore } from '~/store/data/drinks'

export const useTotalStore = defineStore('totalStore', () => {
  const { $i18n } = useNuxtApp()
  const { supabase } = useSupabaseStore()
  const { formatDrinkCounters } = useProcessDate()
  const drinkCountersStore = useDrinkCountersStore()
  const { drinkCounters } = storeToRefs(drinkCountersStore)
  const { fetchDrinkCounters } = drinkCountersStore
  const drinksStore = useDrinksStore()
  const { drinks, getDrinksIdArray } = storeToRefs(drinksStore)
  const { fetchDrinks } = drinksStore

  const chartDataTitle = ['Name', 'Count']
  const sumCount = ref<Array<{ drink_id: number, count: number }>>([])

  const fetchDrinkCountersAll = async () => {
    const fetchDrinksError = await fetchDrinks()
    if (fetchDrinksError) {
      showDangerToast($i18n.t(fetchDrinksError))
      return
    }
    const fetchDrinkCountersError = await fetchDrinkCounters()
    if (fetchDrinkCountersError) {
      showDangerToast($i18n.t(fetchDrinkCountersError))
      return
    }
    const fetchSumCountError = await fetchSumCount()
    if (fetchSumCountError) {
      showDangerToast($i18n.t(fetchSumCountError))
    }
  }

  const fetchSumCount = async () => {
    const { data, error } = await supabase.rpc('sum_count')
    if (error) {
      return 'error.500_API_ERROR'
    }
    sumCount.value = data ?? []
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
    return sumCount.value.map(
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
    chartDataTitle,
    calendarTitle,
    fetchDrinkCountersAll,
    computeCalendarData,
    computedTableData,
    computedChartData,
    computedPieChartOptions,
  }
})
