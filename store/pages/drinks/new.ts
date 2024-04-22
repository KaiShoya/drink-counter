import { useDrinksStore } from '~/store/data/drinks'
import { useDrinkLabelsStore } from '~/store/data/drinkLabels'

export const usePageDrinkNewStore = defineStore('pageDrinkNewStore', () => {
  const { $i18n } = useNuxtApp()
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
    let error = await fetchDrinks()
    if (error) {
      showDangerToast($i18n.t(error))
      return
    }
    error = await fetchDrinkLabels()
    if (error) {
      showDangerToast($i18n.t(error))
      return
    }
    name.value = ''
    color.value = generateRandomColor()
    amount.value = 1
    drinkLabelId.value = null
  }

  const create = async () => {
    const error = await createDrink(name.value, color.value, amount.value, drinkLabelId.value)
    if (error) {
      showDangerToast($i18n.t(error, { name: name.value }))
    } else {
      showSuccessToast($i18n.t('drinks.create_success', { name: name.value }))
      navigateTo('/drinks')
    }
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
