export function usePageDrinkEditActions () {
  const { drinkId, name, color, amount, drinkLabelId } = usePageDrinkEditState()

  const { t } = useI18n()
  const localePath = useLocalePath()

  const drinksStore = useDrinksStore()
  const { fetchDrinks, findDrink, updateDrink } = drinksStore
  const drinkLabelsStore = useDrinkLabelsStore()
  const { fetchDrinkLabels } = drinkLabelsStore

  const initPage = async () => {
    const route = useRoute()
    drinkId.value = Number(route.params.id)
    await fetchDrinks()
    await fetchDrinkLabels()

    const drink = findDrink(drinkId.value)
    if (drink === undefined) {
      showDangerToast(t(LOCALE_ERROR_GET_RECORD))
      navigateTo(localePath('/drinks'))
    } else {
      name.value = drink.name
      color.value = drink.color
      amount.value = drink.amount
      drinkLabelId.value = drink.drink_label_id
    }
  }

  const updateDrinkById = async () => {
    await updateDrink(drinkId.value, name.value, color.value, amount.value, drinkLabelId.value)
    showSuccessToast(t(LOCALE_DRINKS_UPDATE_SUCCESS, { name: name.value }))
    navigateTo(localePath('/drinks'))
  }

  return {
    initPage,
    updateDrinkById,
  }
}
