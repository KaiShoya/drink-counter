import { useSupabaseStore } from '~/store/supabase'
import { Drink } from '~/store/data/types/drink'

export const useDrinksStore = defineStore('drinksStore', () => {
  const { supabase } = useSupabaseStore()
  const drinks: Ref<Drink[]> = useState(() => [])

  /**
   * Drinksテーブルから飲み物のデータを取得する
   */
  const fetchDrinks = async () => {
    const { data } = await supabase.from('drinks').select('*')
    drinks.value = data ?? []
  }

  /**
   * drink.idの配列を返却する
   */
  const getDrinksIdArray = computed(() => {
    return drinks.value.map(d => d.id)
  })

  /**
   * drink.nameの配列を返却する
   */
  const getDrinksNameArray = computed(() => {
    return drinks.value.map(d => d.name)
  })

  return {
    drinks,
    fetchDrinks,
    getDrinksIdArray,
    getDrinksNameArray,
  }
})
