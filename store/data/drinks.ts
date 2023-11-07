import { useSupabaseStore } from '~/store/supabase'
import type { Drink } from '~/store/data/types/drink'

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
   * Drinksテーブルから表示状態の飲み物のデータを取得する
   */
  const fetchDrinksVisible = async () => {
    const { data } = await supabase.from('drinks').select('*').eq('visible', true)
    drinks.value = data ?? []
  }

  /**
   * 指定したIDの飲み物データを取得する
   * @param drinkId number
   * @returns Drink | undefined
   */
  const findDrink = (drinkId: number) => drinks.value.find((d: Drink) => d.id === Number(drinkId))

  /**
   * 指定したIDの飲み物を削除する
   * 削除に成功したらDrinksを再取得する
   * @param drinkId number
   * @returns Promise<PostgrestError | null>
   */
  const deleteDrinkById = async (drinkId: number) => {
    const { error } = await supabase.rpc('delete_drink_data', { drinkid: drinkId })
    // const { error } = await supabase.from('drinks').delete().eq('id', drinkId)
    if (!error) {
      await fetchDrinks()
    }
    return error
  }

  /**
   * 指定したIDの飲み物を更新する
   * @param drinkId number
   * @param name string
   * @param color string | null
   * @returns Promise<PostgrestError | null>
   */
  const updateDrink = async (drinkId: number, name: string, color: string | null) => {
    const { error } = await supabase.from('drinks').update({ name, color }).eq('id', drinkId)
    if (!error) {
      const drink = findDrink(drinkId)
      if (drink) {
        drink.name = name
        drink.color = color
      }
    }
    return error
  }

  const updateDrinkVisible = async (drinkId: number, visible: boolean) => {
    const { error } = await supabase.from('drinks').update({ visible }).eq('id', drinkId)
    if (!error) {
      const drink = findDrink(drinkId)
      if (drink) {
        drink.visible = visible
      }
    }
    return error
  }

  const createDrink = async (name: string, color: string | null) => {
    const { error } = await supabase.from('drinks').insert({ name, color })
    if (!error) {
      await fetchDrinks()
    }
    return error
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
    findDrink,
    fetchDrinksVisible,
    fetchDrinks,
    deleteDrinkById,
    updateDrink,
    updateDrinkVisible,
    createDrink,
    getDrinksIdArray,
    getDrinksNameArray,
  }
})
