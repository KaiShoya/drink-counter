export const useAggregationByDrinksGetters = () => {
  const { chartDataTitle, aggregationByDrinks } = useAggregationByDrinksState()

  const drinkLabelsStore = useDrinkLabelsStore()
  const { drinkLabels } = storeToRefs(drinkLabelsStore)

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
    computedTableData,
    computedSumCount,
    computedChartData,
    computedPieChartOptions,
  }
}
