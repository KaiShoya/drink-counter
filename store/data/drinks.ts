import { useSupabaseStore } from '~/store/supabase'
import type { Drink } from '~/store/data/types/drink'

export const useDrinksStore = defineStore('drinksStore', () => {
  const { supabase } = useSupabaseStore()
  const drinks = ref<Drink[]>([])

  /**
   * Drinksテーブルから飲み物のデータを取得する
   * @returns Promise<error_message_code | undefined>
   */
  const fetchDrinks = async () => {
    const { data, error } = await supabase.from('drinks').select('*').order('sort,id')
    if (error) {
      return 'error.500_API_ERROR'
    }
    drinks.value = data ?? []

    // デフォルトカラーをランダムセットする
    drinks.value.forEach((drink) => {
      drink.default_color = generateRandomColor()
    })
  }

  /**
   * 表示状態の飲み物のデータを返却する
   */
  const findDrinksVisible = () => drinks.value.filter((drink: Drink) => drink.visible)

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
   * @returns Promise<error_message_code | undefined>
   */
  const deleteDrinkById = async (drinkId: number) => {
    const { error } = await supabase.rpc('delete_drink_data', { drinkid: drinkId })
    if (error) {
      return 'drinks.delete_failure'
    }

    const fetchDrinkError = await fetchDrinks()
    return fetchDrinkError
  }

  /**
   * 指定したIDの飲み物を更新する
   * @param drinkId number
   * @param name string
   * @param color string | null
   * @returns Promise<error_message_code | undefined>
   */
  const updateDrink = async (drinkId: number, name: string, color: string | null) => {
    const { error } = await supabase.from('drinks').update({ name, color }).eq('id', drinkId)
    if (error) {
      return 'error.500_API_ERROR'
    }
    const drink = findDrink(drinkId)
    if (drink) {
      drink.name = name
      drink.color = color
    }
  }

  const updateDrinkVisible = async (drinkId: number, visible: boolean) => {
    const { error } = await supabase.from('drinks').update({ visible }).eq('id', drinkId)
    if (error) {
      return 'drinks.update_failure'
    }
    const drink = findDrink(drinkId)
    if (drink) {
      drink.visible = visible
    }
  }

  const updateDrinksSort = async () => {
    const payload = drinks.value.map((drink, i) => {
      drink.sort = i
      return {
        id: drink.id,
        sort: drink.sort,
      }
    })
    const { error } = await supabase.rpc('bulk_update_drinks_sort', { payload })
    if (error) {
      return 'error.500_API_ERROR'
    }
  }

  const createDrink = async (name: string, color: string | null) => {
    const { error } = await supabase.from('drinks').insert({ name, color })
    if (error) {
      return 'drinks.create_failure'
    }
    const fetchDrinkError = await fetchDrinks()
    return fetchDrinkError
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
    findDrinksVisible,
    fetchDrinks,
    updateDrinksSort,
    deleteDrinkById,
    updateDrink,
    updateDrinkVisible,
    createDrink,
    getDrinksIdArray,
    getDrinksNameArray,
  }
})
