import { useSupabaseStore } from './supabase'
import { DrinkCounter } from './types/drinkCounter'

export const useDrinkCountersStore = defineStore('drinkCountersStore', () => {
  const { supabase } = useSupabaseStore()
  const drinkCounters: Ref<DrinkCounter[]> = useState('drinkCounters', () => [])
  const drinkCountersPerMonth: Ref<DrinkCounter[]> = useState('drinkCountersPerMonth', () => [])
  const drinkCountersForDay: Ref<DrinkCounter[]> = useState('drinkCountersForDay', () => [])

  const fetchDrinkCounters = async () => {
    const { data } = await supabase.from('drink_counters').select('*').order('date,drink_id').gt('count', 0)
    drinkCounters.value = data ?? []
  }

  const fetchDrinkCountersPerMonth = async (year: number, month: number) => {
    const { data } = await supabase.from('drink_counters').select('*').order('date,drink_id').gt('count', 0).gte('date', `${year}-${month}-01`).lt('date', `${year}-${month + 1}-01`)
    drinkCountersPerMonth.value = data ?? []
  }

  const fetchDrinkCountersForDay = async (date: string) => {
    const { data } = await supabase.from('drink_counters').select('*').eq('date', date)
    drinkCountersForDay.value = data ?? []
  }

  const increment = async (id: number) => {
    const { data } = await supabase.rpc('increment', { row_id: id })
    drinkCountersForDay.value.find(dc => dc.id === id)!.count = data?.count ?? 0
  }
  const decrement = async (id: number) => {
    const { data } = await supabase.rpc('decrement', { row_id: id })
    drinkCountersForDay.value.find(dc => dc.id === id)!.count = data?.count ?? 0
  }
  const create = async (drinkId: number, date = 'now()') => {
    const { data } = await supabase.from('drink_counters').insert({ date, drink_id: drinkId, count: 1 }).select()
    if (data && data.length > 0) {
      drinkCountersForDay.value.push(data[0])
    }
  }

  return {
    drinkCounters,
    drinkCountersPerMonth,
    drinkCountersForDay,
    fetchDrinkCounters,
    fetchDrinkCountersPerMonth,
    fetchDrinkCountersForDay,
    increment,
    decrement,
    create,
  }
})
