import { storeToRefs } from 'pinia'

import { useSupabaseStore } from '~/store/supabase'
import { useDrinkCountersStore } from '~/store/data/drinkCounters'
import { useDrinksStore } from '~/store/data/drinks'
import { useAggregationByDowTablesStore } from '~/store/pages/data/components/aggregationByDowTables'

export const useTotalStore = defineStore('totalStore', () => {
  const { $i18n } = useNuxtApp()
  const { supabase } = useSupabaseStore()
  const drinkCountersStore = useDrinkCountersStore()
  const { fetchDrinkCounters } = drinkCountersStore
  const drinksStore = useDrinksStore()
  const { drinks } = storeToRefs(drinksStore)
  const { fetchDrinks } = drinksStore
  const { fetchAggregationByDow } = useAggregationByDowTablesStore()

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
    const fetchAggregationByDowError = await fetchAggregationByDow()
    if (fetchAggregationByDowError) {
      showDangerToast($i18n.t(fetchAggregationByDowError))
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
    fetchDrinkCountersAll,
    computedTableData,
    computedChartData,
    computedPieChartOptions,
  }
})
