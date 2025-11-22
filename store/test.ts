export const useTestStore = defineStore('testStore', () => {
  const { t } = useI18n()
  const drinksStore = useDrinksStore()
  const { fetchDrinks, findDrink } = drinksStore
  const drinkLabelsStore = useDrinkLabelsStore()
  const { fetchDrinkLabels } = drinkLabelsStore

  // 編集対象のドリンクID
  const drinkId = ref<number>(1)
  // 編集対象のドリンク名
  const name = ref<string>('')
  // 編集対象の量
  const drinkLabelId = ref<number | null>(null)

  const initPage = async () => {
    await fetchDrinks()
      .catch((error) => {
        console.error(error)
        throw error
      })

    await fetchDrinkLabels()

    const drink = findDrink(drinkId.value)
    if (drink === undefined) {
      showDangerToast(t(LOCALE_ERROR_GET_RECORD))
    } else {
      name.value = drink.name
      drinkLabelId.value = drink.drink_label_id
    }
  }

  return {
    drinkId,
    name,
    drinkLabelId,
    initPage,
  }
})
