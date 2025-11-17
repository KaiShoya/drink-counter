import type { DrinkRow } from "~/utils/api/drinksRepository"

export function usePageDrinksActions () {
  const { deleteTarget, showDeleteModal } = usePageDrinksState()

  const { t } = useI18n()
  const drinksStore = useDrinksStore()
  const { updateDrinkVisible, updateDrinksSort, deleteDrinkById } = drinksStore

  /**
   * 飲み物の表示/非表示を切り替える
   * @param drink DrinkRow
   * @returns
   */
  const updateHidden = async (drink: DrinkRow) => {
    await updateDrinkVisible(drink.id, !drink.visible)
    showSuccessToast(t(LOCALE_DRINKS_UPDATE_VISIBLE_SUCCESS, { name: drink.name, status: t(`drinks.${drink.visible ? 'visible' : 'invisible'}`) }))
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
    showSuccessToast(t(LOCALE_DRINKS_DELETE_SUCCESS, { name: drinkName }))
    showDeleteModal.value = false
  }

  /**
   * 削除ボタンクリック時の処理
   * @param drink DrinkRow
   * @returns
   */
  const clickDeleteDrinkButton = (drink: DrinkRow) => {
    deleteTarget.value = drink
    showDeleteModal.value = true
  }

  /**
   * ソート順を保存する
   */
  const save = async () => {
    await updateDrinksSort()
    showSuccessToast(t(LOCALE_DRINKS_SORT_SUCCESS))
  }

  return {
    updateHidden,
    deleteDrink,
    clickDeleteDrinkButton,
    save,
  }
}
