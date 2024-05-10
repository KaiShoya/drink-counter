import { useSupabaseStore } from '~/store/supabase'
import type { Drink } from '~/store/data/types/drink'

const TABLE_NAME = 'drinks'

export const useDrinksStore = defineStore('drinksStore', () => {
  const { supabase } = useSupabaseStore()
  const drinks = ref<Drink[]>([])

  /**
   * Drinksテーブルから飲み物のデータを取得する
   * @returns Promise<error_message_code | undefined>
   */
  const fetchDrinks = async () => {
    const { data, error } = await supabase.from(TABLE_NAME).select('*').order('sort,id')
    if (error) {
      throw new Response500Error()
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
   * @param name string
   * @returns Promise<error_message_code | undefined>
   */
  const deleteDrinkById = async (drinkId: number, name: string) => {
    const { error } = await supabase.rpc('delete_drink_data', { drinkid: drinkId })
    if (error) {
      throw new SupabaseResponseError(LOCALE_DRINKS_DELETE_FAILURE, { name })
    }
    await fetchDrinks()
  }

  /**
   * 指定したIDの飲み物を更新する
   * @param drinkId number
   * @param name string
   * @param color string | null
   * @param amount number
   * @param driknLabelId number | null
   * @returns Promise<error_message_code | undefined>
   */
  const updateDrink = async (drinkId: number, name: string, color: string | null, amount: number, driknLabelId: number | null) => {
    const { error } = await supabase.from(TABLE_NAME).update({ name, color, amount, drink_label_id: driknLabelId }).eq('id', drinkId)
    if (error) {
      throw new SupabaseResponseError(LOCALE_DRINKS_UPDATE_FAILURE, { name })
    }
    const drink = findDrink(drinkId)
    if (!drink) {
      throw new GetRecordError()
    }
    drink.name = name
    drink.color = color
  }

  const updateDrinkVisible = async (drinkId: number, visible: boolean) => {
    const drink = findDrink(drinkId)
    if (!drink) {
      throw new GetRecordError()
    }
    const { error } = await supabase.from(TABLE_NAME).update({ visible }).eq('id', drinkId)
    if (error) {
      throw new SupabaseResponseError(LOCALE_DRINKS_UPDATE_FAILURE, { name: drink.name })
    }
    drink.visible = visible
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
      throw new Response500Error()
    }
  }

  const createDrink = async (name: string, color: string | null, amount: number, driknLabelId: number | null) => {
    const { error } = await supabase.from(TABLE_NAME).insert({ name, color, amount, drink_label_id: driknLabelId })
    if (error) {
      throw new SupabaseResponseError(LOCALE_DRINKS_CREATE_FAILURE, { name })
    }
    await fetchDrinks()
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
