import { useSupabaseStore } from './supabase'
import { Drink } from './types/drink'

export const useDrinksStore = defineStore('drinksStore', () => {
  const { supabase } = useSupabaseStore()
  const drinks: Ref<Drink[]> = useState('drinks', () => [])

  /**
   * Drinksテーブルから飲み物のデータを取得する
   */
  const fetchDrinks = async () => {
    const { data } = await supabase.from('drinks').select('*')
    drinks.value = data ?? []
  }

  return {
    drinks,
    fetchDrinks,
  }
})
