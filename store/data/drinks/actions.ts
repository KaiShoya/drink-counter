const TABLE_NAME = 'drinks'

export function useDrinksActions () {
  const { drinks } = useDrinksState()
  const { findDrink } = useDrinksGetters()

  const { $drinksRepository } = useNuxtApp()

  /**
   * Drinksテーブルから飲み物のデータを取得する
   * @returns Promise<error_message_code | undefined>
   */
  const fetchDrinks = async () => {
    drinks.value = await $drinksRepository.fetchAll()
  }

  /**
   * 指定したIDの飲み物を削除する
   * 削除に成功したらDrinksを再取得する
   * @param drinkId number
   * @param name string
   * @returns Promise<error_message_code | undefined>
   */
  const deleteDrinkById = async (drinkId: number, name: string) => {
    await $drinksRepository.deleteById(drinkId, name)
    drinks.value = drinks.value.filter(d => d.id !== drinkId)
  }

  /**
   * 指定したIDの飲み物を更新する
   * @param drinkId number
   * @param name string
   * @param color string | null
   * @param amount number
   * @param drinkLabelId number | null
   * @returns Promise<error_message_code | undefined>
   */
  const updateDrink = async (drinkId: number, name: string, color: string | null, amount: number, drinkLabelId: number | null) => {
    const drink = findDrink(drinkId)
    if (!drink) {
      throw new GetRecordError()
    }
    await $drinksRepository.updateById(drinkId, name, color, amount, drinkLabelId)
    drink.name = name
    drink.color = color
    drink.amount = amount
    drink.drink_label_id = drinkLabelId

    drinks.value = drinks.value.map(d => (d.id === drinkId ? drink : d))
  }

  const updateDrinkVisible = async (drinkId: number, visible: boolean) => {
    const drink = findDrink(drinkId)
    if (!drink) {
      throw new GetRecordError()
    }
    await $drinksRepository.updateVisible(drinkId, drink.name, visible)
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
    await $drinksRepository.updateSort(payload)
  }

  const createDrink = async (name: string, color: string | null, amount: number, drinkLabelId: number | null) => {
    const drink = await $drinksRepository.create(name, color, amount, drinkLabelId)
    drinks.value.push(drink)
  }

  return {
    fetchDrinks,
    deleteDrinkById,
    updateDrink,
    updateDrinkVisible,
    updateDrinksSort,
    createDrink,
  }
}
