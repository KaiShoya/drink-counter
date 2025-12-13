import type { AggregationByDow } from '~/repositories/drinkCountersRepository'

export function useAggregationByDowGetters () {
  const { t } = useI18n()
  const { aggregationByDow } = useAggregationByDowState()

  const computedAggregationByDowToArray = computed(() => {
    return aggregationByDow.value.map((data: AggregationByDow) => [
      t(`calendar.day_of_week.${data.dow}`),
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
