export function usePageDrinkNewActions () {
  const { name, color, amount, drinkLabelId } = usePageDrinkNewState()

  const { t } = useI18n()
  const localePath = useLocalePath()

  const drinksStore = useDrinksStore()
  const { fetchDrinks, createDrink } = drinksStore
  const drinkLabelsStore = useDrinkLabelsStore()
  const { fetchDrinkLabels } = drinkLabelsStore

  const initPage = async () => {
    await fetchDrinks()
    await fetchDrinkLabels()

    name.value = ''
    color.value = generateRandomColor()
    amount.value = 1
    drinkLabelId.value = null
  }

  const create = async () => {
    await createDrink(name.value, color.value, amount.value, drinkLabelId.value)
    showSuccessToast(t(LOCALE_DRINKS_CREATE_SUCCESS, { name: name.value }))
    navigateTo(localePath('/drinks'))
  }

  return {
    initPage,
    create,
  }
}
