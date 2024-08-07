export const useAggregationByDowActions = () => {
  const { aggregationByDow } = useAggregationByDowState()

  const { supabase } = useSupabaseStore()

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

  return {
    fetchAggregationByDow,
    fetchAggregationByDowPerYear,
    fetchAggregationByDowPerMonth,
  }
}
