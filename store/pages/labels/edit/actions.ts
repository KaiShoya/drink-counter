export function usePageDrinkLabelEditActions () {
  const { drinkLabelId, name, color, standardAmount } = usePageDrinkLabelEditState()
  const { t } = useI18n()
  const localePath = useLocalePath()

  const { findById, updateDrinkLabel } = useDrinkLabelsStore()

  const initPage = async () => {
    const route = useRoute()
    drinkLabelId.value = Number(route.params.id)

    const drinkLabel = findById(drinkLabelId.value)
    if (drinkLabel === undefined) {
      showDangerToast(t(LOCALE_ERROR_GET_RECORD))
      navigateTo(localePath('/labels'))
    } else {
      name.value = drinkLabel.name
      color.value = drinkLabel.color
      standardAmount.value = drinkLabel.standard_amount
    }
  }

  const update = async () => {
    await updateDrinkLabel(drinkLabelId.value, name.value, color.value, standardAmount.value)
    showSuccessToast(t(LOCALE_DRINKS_UPDATE_SUCCESS, { name: name.value }))
    navigateTo(localePath('/labels'))
  }

  return {
    initPage,
    update,
  }
}
