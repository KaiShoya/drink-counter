import { defineStore } from 'pinia'

import { useSupabaseStore } from '~/store/supabase'
import { useDrinksStore } from '~/store/data/drinks'
import type { AggregationByDrink } from '~/store/pages/data/components/types/aggregationByDrinksTable'

export const useAggregationByDrinksTablesStore = defineStore('aggregationByDrinksTablesStore', () => {
  const { supabase } = useSupabaseStore()
  const drinksStore = useDrinksStore()
  const { drinks } = storeToRefs(drinksStore)

  const chartDataTitle = ['Name', 'Count']
  const aggregationByDrinks = ref<Array<AggregationByDrink>>([])

  const fetchSumCount = async () => {
    const { data, error } = await supabase.rpc('sum_count')
    if (error) {
      return 'error.500_API_ERROR'
    }
    aggregationByDrinks.value = data ?? []
  }

  const fetchSumCountPerYear = async (year: number) => {
    const { data, error } = await supabase.rpc('sum_count_per_year', { year })
    if (error) {
      return 'error.500_API_ERROR'
    }
    aggregationByDrinks.value = data ?? []
  }

  const fetchSumCountPerMonth = async (year: number, month: number) => {
    const { data, error } = await supabase.rpc('sum_count_per_month', { year, month })
    if (error) {
      return 'error.500_API_ERROR'
    }
    aggregationByDrinks.value = data ?? []
  }

  /**
   * テーブル用データ（円グラフでも利用）
   */
  const computedTableData = computed(() => {
    return aggregationByDrinks.value.map(
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

  /**
   * PieChart用のカラーコード配列
   */
  const computedPieChartOptions = computed(() => {
    return {
      colors: drinks.value.map(drink => drink.color ?? drink.default_color),
    }
  })

  return {
    chartDataTitle,
    aggregationByDrinks,
    fetchSumCount,
    fetchSumCountPerYear,
    fetchSumCountPerMonth,
    computedTableData,
    computedChartData,
    computedPieChartOptions,
  }
})
