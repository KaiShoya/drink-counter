export function usePageDrinksActions () {
  const { deleteTarget, showDeleteModal } = usePageDrinksState()

  const { $i18n } = useNuxtApp()
  const drinksStore = useDrinksStore()

  const { fetchDrinks, updateDrinkVisible, updateDrinksSort, deleteDrinkById } = drinksStore
  const drinkLabelsStore = useDrinkLabelsStore()
  const { fetchDrinkLabels } = drinkLabelsStore

  const initPage = async () => {
    await fetchDrinks()
    await fetchDrinkLabels()
  }

  /**
   * 飲み物の表示/非表示を切り替える
   * @param drink Drink
   * @returns
   */
  const updateHidden = async (drink: Drink) => {
    await updateDrinkVisible(drink.id, !drink.visible)
    showSuccessToast($i18n.t(LOCALE_DRINKS_UPDATE_VISIBLE_SUCCESS, { name: drink.name, status: $i18n.t(`drinks.${drink.visible ? 'visible' : 'invisible'}`) }))
  }

  /**
   * 指定した飲み物を削除する
   * @param drinkId number | undefined
   * @param drinkName string | undefined
   * @returns
   */
  const deleteDrink = async (drinkId: number | undefined, drinkName: string | undefined) => {
    if (drinkId === undefined || drinkName === undefined) {
      showDeleteModal.value = false
      throw new GetRecordError()
    }
    await deleteDrinkById(drinkId, drinkName)
      .catch((error) => {
        showDeleteModal.value = false
        throw error
      })
    showSuccessToast($i18n.t(LOCALE_DRINKS_DELETE_SUCCESS, { name: drinkName }))
    showDeleteModal.value = false
  }

  /**
   * 削除ボタンクリック時の処理
   * @param drink Drink
   * @returns
   */
  const clickDeleteDrinkButton = (drink: Drink) => {
    deleteTarget.value = drink
    showDeleteModal.value = true
  }

  /**
   * ソート順を保存する
   */
  const save = async () => {
    await updateDrinksSort()
    showSuccessToast($i18n.t(LOCALE_DRINKS_SORT_SUCCESS))
  }

  return {
    initPage,
    updateHidden,
    deleteDrink,
    clickDeleteDrinkButton,
    save,
  }
}
