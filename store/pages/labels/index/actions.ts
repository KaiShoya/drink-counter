export function usePageDrinkLabelsActions () {
  const { deleteTarget, showDeleteModal } = usePageDrinkLabelsState()
  const { $i18n } = useNuxtApp()

  const drinkLabelsStore = useDrinkLabelsStore()
  const { fetchDrinkLabels, updateDrinkLabelVisible, deleteById, updateDrinkLabelsSort } = drinkLabelsStore

  const initPage = async () => {
    await fetchDrinkLabels()
  }

  /**
 * ラベルの表示/非表示を切り替える
 * @param drink Drink
 * @returns
 */
  const updateHidden = async (label: DrinkLabel) => {
    await updateDrinkLabelVisible(label.id, label.name, !label.visible)
    showSuccessToast($i18n.t(LOCALE_DRINKS_UPDATE_VISIBLE_SUCCESS, { name: label.name, status: $i18n.t(`drinks.${label.visible ? 'visible' : 'invisible'}`) }))
  }

  const deleteDrinkLabel = async (drinkLabelId: number | undefined, drinkLabelName: string | undefined) => {
    if (drinkLabelId === undefined || drinkLabelName === undefined) {
      showDangerToast($i18n.t(LOCALE_ERROR_GET_RECORD))
      showDeleteModal.value = false
      return
    }
    await deleteById(drinkLabelId, drinkLabelName)
      .catch((error) => {
        showDeleteModal.value = false
        throw error
      })
    showSuccessToast($i18n.t(LOCALE_DRINKS_DELETE_SUCCESS, { name: drinkLabelName }))
    showDeleteModal.value = false
  }

  const clickDeleteDrinkButton = (drinkLabel: DrinkLabel) => {
    deleteTarget.value = drinkLabel
    showDeleteModal.value = true
  }

  const saveSort = async () => {
    await updateDrinkLabelsSort()
    showSuccessToast($i18n.t(LOCALE_DRINKS_SORT_SUCCESS))
  }

  return {
    initPage,
    updateHidden,
    deleteDrinkLabel,
    clickDeleteDrinkButton,
    saveSort,
  }
}
