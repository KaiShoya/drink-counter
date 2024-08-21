export const useAggregationByDowGetters = () => {
  const { $i18n } = useNuxtApp()
  const { aggregationByDow } = useAggregationByDowState()

  const computedAggregationByDowToArray = computed(() => {
    return aggregationByDow.value.map((data: AggregationByDow) => [
      $i18n.t(`calendar.day_of_week.${data.dow}`),
      data.sum_count,
      data.avg_count,
      data.max_type_of_drinks,
      data.avg_type_of_drinks,
      data.record_count,
    ])
  })

  return {
    computedAggregationByDowToArray,
  }
}
