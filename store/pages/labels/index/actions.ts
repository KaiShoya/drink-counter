export function usePageDrinkLabelsActions () {
  const { deleteTarget, showDeleteModal } = usePageDrinkLabelsState()
  const { t } = useI18n()

  const { updateDrinkLabelVisible, deleteById, updateDrinkLabelsSort } = useDrinkLabelsStore()

  /**
   * ラベルの表示/非表示を切り替える
   * @param drink Drink
   * @returns
   */
  const updateHidden = async (label: DrinkLabel) => {
    await updateDrinkLabelVisible(label.id, label.name, !label.visible)
    showSuccessToast(t(LOCALE_DRINKS_UPDATE_VISIBLE_SUCCESS, { name: label.name, status: t(`drinks.${label.visible ? 'visible' : 'invisible'}`) }))
  }

  const deleteDrinkLabel = async (drinkLabelId: number | undefined, drinkLabelName: string | undefined) => {
    if (drinkLabelId === undefined || drinkLabelName === undefined) {
      showDangerToast(t(LOCALE_ERROR_GET_RECORD))
      showDeleteModal.value = false
      return
    }
    await deleteById(drinkLabelId, drinkLabelName)
      .catch((error) => {
        showDeleteModal.value = false
        throw error
      })
    showSuccessToast(t(LOCALE_DRINKS_DELETE_SUCCESS, { name: drinkLabelName }))
    showDeleteModal.value = false
  }

  const clickDeleteDrinkButton = (drinkLabel: DrinkLabel) => {
    deleteTarget.value = drinkLabel
    showDeleteModal.value = true
  }

  const saveSort = async () => {
    await updateDrinkLabelsSort()
    showSuccessToast(t(LOCALE_DRINKS_SORT_SUCCESS))
  }

  return {
    updateHidden,
    deleteDrinkLabel,
    clickDeleteDrinkButton,
    saveSort,
  }
}
