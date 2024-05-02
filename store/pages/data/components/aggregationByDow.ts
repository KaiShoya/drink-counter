import { defineStore } from 'pinia'

import { useSupabaseStore } from '~/store/supabase'
import type { AggregationByDow } from '~/store/pages/data/components/types/aggregationByDow'

export const useAggregationByDowStore = defineStore('aggregationByDowStore', () => {
  const { $i18n } = useNuxtApp()
  const { supabase } = useSupabaseStore()

  const aggregationByDow = ref<Array<AggregationByDow>>([])

  const fetchAggregationByDow = async () => {
    const { data, error } = await supabase.rpc('aggregation_by_dow')
    if (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      throw new Response500Error()
    }
    aggregationByDow.value = data ?? []
  }

  const fetchAggregationByDowPerYear = async (year: number) => {
    const { data, error } = await supabase.rpc('aggregation_by_dow', { year })
    if (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      throw new Response500Error()
    }
    aggregationByDow.value = data ?? []
  }

  const fetchAggregationByDowPerMonth = async (year: number, month: number) => {
    const { data, error } = await supabase.rpc('aggregation_by_dow', { year, month })
    if (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      throw new Response500Error()
    }
    aggregationByDow.value = data ?? []
  }

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
    aggregationByDow,
    fetchAggregationByDow,
    fetchAggregationByDowPerYear,
    fetchAggregationByDowPerMonth,
    computedAggregationByDowToArray,
  }
})
