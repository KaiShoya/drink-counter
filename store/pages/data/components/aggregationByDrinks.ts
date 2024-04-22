import { defineStore } from 'pinia'

import { useSupabaseStore } from '~/store/supabase'
import { useDrinkLabelsStore } from '~/store/data/drinkLabels'
import type { AggregationByDrinkLabel } from '~/store/pages/data/components/types/aggregationByDrinkLabel'

export const useAggregationByDrinksStore = defineStore('aggregationByDrinksStore', () => {
  const { supabase } = useSupabaseStore()
  const drinkLabelsStore = useDrinkLabelsStore()
  const { drinkLabels } = storeToRefs(drinkLabelsStore)
  const { fetchDrinkLabels } = drinkLabelsStore

  const chartDataTitle = ref<Array<string>>(['Name', 'Count'])
  const aggregationByDrinks = ref<Array<AggregationByDrinkLabel>>([])

  const fetchSumCount = async () => {
    const fetchDrinkLabelsError = await fetchDrinkLabels()
    if (fetchDrinkLabelsError) {
      return fetchDrinkLabelsError
    }
    const { data, error } = await supabase.rpc('aggregation_by_drink_labels')
    if (error) {
      return 'error.500_API_ERROR'
    }
    aggregationByDrinks.value = data ?? []
  }

  const fetchSumCountPerYear = async (year: number) => {
    const fetchDrinkLabelsError = await fetchDrinkLabels()
    if (fetchDrinkLabelsError) {
      return fetchDrinkLabelsError
    }
    const { data, error } = await supabase.rpc('aggregation_by_drink_labels', { year })
    if (error) {
      return 'error.500_API_ERROR'
    }
    aggregationByDrinks.value = data ?? []
  }

  const fetchSumCountPerMonth = async (year: number, month: number) => {
    const fetchDrinkLabelsError = await fetchDrinkLabels()
    if (fetchDrinkLabelsError) {
      return fetchDrinkLabelsError
    }
    const { data, error } = await supabase.rpc('aggregation_by_drink_labels', { year, month })
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
      (v: { drink_label_id: number, count: number }) => [
        drinkLabels.value.find(label => label.id === v.drink_label_id)!.name,
        v.count,
      ],
    )
  })

  /**
   * 合計値計算ロジック
   */
  const computedSumCount = computed(() => {
    return computedTableData.value.reduce((accumulator, currentValue) => accumulator + Number(currentValue[1]), 0)
  })

  /**
   * 円グラフ用データ
   */
  const computedChartData = computed(() => {
    return [chartDataTitle.value, ...computedTableData.value]
  })

  /**
   * PieChart用のカラーコード配列
   */
  const computedPieChartOptions = computed(() => {
    return {
      colors: drinkLabels.value.map(label => label.color ?? label.default_color),
    }
  })

  return {
    chartDataTitle,
    aggregationByDrinks,
    fetchSumCount,
    fetchSumCountPerYear,
    fetchSumCountPerMonth,
    computedTableData,
    computedSumCount,
    computedChartData,
    computedPieChartOptions,
  }
})
