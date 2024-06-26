import { useDrinksStore } from '~/store/data/drinks'
import { useDrinkLabelsStore } from '~/store/data/drinkLabels'

export const usePageDrinkEditStore = defineStore('pageDrinkEditStore', () => {
  const { $i18n } = useNuxtApp()
  const localePath = useLocalePath()
  const drinksStore = useDrinksStore()
  const { fetchDrinks, findDrink, updateDrink } = drinksStore
  const drinkLabelsStore = useDrinkLabelsStore()
  const { fetchDrinkLabels } = drinkLabelsStore

  // 編集対象のドリンクID
  const drinkId = ref<number>(0)

  // 編集対象のドリンク名
  const name = ref<string>('')
  // 編集対象の色
  const color = ref<string | null>(null)
  // 編集対象の量
  const amount = ref<number>(1)
  // 編集対象の量
  const drinkLabelId = ref<number | null>(null)

  const initPage = async () => {
    const route = useRoute()
    drinkId.value = Number(route.params.id)
    await fetchDrinks()
    await fetchDrinkLabels()

    const drink = findDrink(drinkId.value)
    if (drink === undefined) {
      showDangerToast($i18n.t(LOCALE_ERROR_GET_RECORD))
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
    showSuccessToast($i18n.t(LOCALE_DRINKS_UPDATE_SUCCESS, { name: name.value }))
    navigateTo(localePath('/drinks'))
  }

  return {
    drinkId,
    name,
    color,
    amount,
    drinkLabelId,
    initPage,
    updateDrinkById,
  }
})
