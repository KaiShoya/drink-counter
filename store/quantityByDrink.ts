import { useSupabaseStore } from './supabase'
import { QuantityByDrink } from './types/quantityByDrink'

export const useDrinksStore = defineStore('drinksStore', () => {
  const { supabase } = useSupabaseStore()
  const quantityByDrink: Ref<QuantityByDrink[]> = useState('drinks', () => [])
  const quantityByDrinkPerMonth: Ref<QuantityByDrink[]> = useState('drinks', () => [])

  const fetchQuantityByDrink = async () => {
    const { data } = await supabase.rpc('sum_count')
    quantityByDrink.value = data || []
  }

  const fetchQuantityByDrinkPerMonth = async (year: number, month: number) => {
    const { data } = await supabase.rpc('sum_count_per_month', { year, month })
    quantityByDrinkPerMonth.value = data
    return data || 0
  }

  return {
    quantityByDrink,
    quantityByDrinkPerMonth,
    fetchQuantityByDrink,
    fetchQuantityByDrinkPerMonth,
  }
})
