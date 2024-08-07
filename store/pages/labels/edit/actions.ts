export function usePageDrinkLabelEditActions () {
  const { drinkLabelId, name, color, standardAmount } = usePageDrinkLabelEditState()
  const { $i18n } = useNuxtApp()
  const localePath = useLocalePath()

  const { fetchDrinks } = useDrinksStore()
  const drinkLabelsStore = useDrinkLabelsStore()
  const { fetchDrinkLabels, findById, updateDrinkLabel } = drinkLabelsStore

  const initPage = async () => {
    const route = useRoute()
    drinkLabelId.value = Number(route.params.id)
    await fetchDrinkLabels()

    const drinkLabel = findById(drinkLabelId.value)
    if (drinkLabel === undefined) {
      showDangerToast($i18n.t(LOCALE_ERROR_GET_RECORD))
      navigateTo(localePath('/labels'))
    } else {
      name.value = drinkLabel.name
      color.value = drinkLabel.color
      standardAmount.value = drinkLabel.standard_amount
    }

    await fetchDrinks()
  }

  const update = async () => {
    await updateDrinkLabel(drinkLabelId.value, name.value, color.value, standardAmount.value)
    showSuccessToast($i18n.t(LOCALE_DRINKS_UPDATE_SUCCESS, { name: name.value }))
    navigateTo(localePath('/labels'))
  }

  return {
    initPage,
    update,
  }
}
