import { useDrinksStore } from '~/store/data/drinks'

export const usePageDrinkNewStore = defineStore('pageDrinkNewStore', () => {
  const { $i18n } = useNuxtApp()
  const drinksStore = useDrinksStore()
  const { fetchDrinks, createDrink } = drinksStore

  // 編集対象のドリンク名
  const name = ref<string>('')
  // 編集対象の色
  const color = ref<string | null>(null)

  const initPage = async () => {
    const error = await fetchDrinks()
    if (error) {
      showDangerToast($i18n.t(error))
      return
    }

    color.value = generateRandomColor()
  }

  const create = async () => {
    const error = await createDrink(name.value, color.value)
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
    initPage,
    create,
  }
})
