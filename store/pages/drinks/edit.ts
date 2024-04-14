import { useDrinksStore } from '~/store/data/drinks'

export const usePageDrinkEditStore = defineStore('pageDrinkEditStore', () => {
  const { $i18n } = useNuxtApp()
  const drinksStore = useDrinksStore()
  const { fetchDrinks, findDrink, updateDrink } = drinksStore

  // 編集対象のドリンクID
  const drinkId = ref<number>(0)

  // 編集対象のドリンク名
  const name = ref<string>('')
  // 編集対象の色
  const color = ref<string | null>(null)

  const initPage = async () => {
    const route = useRoute()
    drinkId.value = Number(route.params.id)
    const error = await fetchDrinks()
    if (error) {
      showDangerToast($i18n.t(error))
      return
    }

    const drink = findDrink(drinkId.value)
    if (drink === undefined) {
      showDangerToast($i18n.t('error.GET_RECORD'))
      navigateTo('/drinks')
    } else {
      name.value = drink.name
      color.value = drink.color
    }
  }

  const updateDrinkById = async () => {
    const error = await updateDrink(drinkId.value, name.value, color.value)
    if (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      showDangerToast($i18n.t('drinks.update_failure', { name: name.value }))
    } else {
      showSuccessToast($i18n.t('drinks.update_success', { name: name.value }))
      navigateTo('/drinks')
    }
  }

  return {
    drinkId,
    name,
    color,
    initPage,
    updateDrinkById,
  }
})
