import { useDrinksStore } from '~/store/data/drinks'
import { useDrinkLabelsStore } from '~/store/data/drinkLabels'

export const usePageDrinkNewStore = defineStore('pageDrinkNewStore', () => {
  const { $i18n } = useNuxtApp()
  const localePath = useLocalePath()
  const drinksStore = useDrinksStore()
  const { fetchDrinks, createDrink } = drinksStore
  const drinkLabelsStore = useDrinkLabelsStore()
  const { fetchDrinkLabels } = drinkLabelsStore

  // 編集対象のドリンク名
  const name = ref<string>('')
  // 編集対象の色
  const color = ref<string | null>(null)
  // 編集対象の量
  const amount = ref<number>(1)
  // 編集対象の量
  const drinkLabelId = ref<number | null>(null)

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
    showSuccessToast($i18n.t(LOCALE_DRINKS_CREATE_SUCCESS, { name: name.value }))
    navigateTo(localePath('/drinks'))
  }

  return {
    name,
    color,
    amount,
    drinkLabelId,
    initPage,
    create,
  }
})
