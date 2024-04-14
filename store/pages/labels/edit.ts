import { useDrinkLabelsStore } from '~/store/data/drinkLabels'

export const usePageDrinkLabelEditStore = defineStore('pageDrinkLabelEditStore', () => {
  const { $i18n } = useNuxtApp()
  const route = useRoute()
  const drinkLabelsStore = useDrinkLabelsStore()
  const { fetchDrinkLabels, findById, updateDrinkLabel } = drinkLabelsStore

  // 編集対象のラベルID
  const drinkLabelId = Number(route.params.id)

  // 編集対象のラベル名
  const name = ref<string>('')
  // 編集対象の色
  const color = ref<string | null>(null)
  // 標準の量
  const standardAmount = ref<number>(1)

  const initPage = async () => {
    const error = await fetchDrinkLabels()
    if (error) {
      showDangerToast($i18n.t(error))
      return
    }

    const drink = findById(drinkLabelId)
    if (drink === undefined) {
      showDangerToast($i18n.t('error.GET_RECORD'))
      navigateTo('/labels')
    } else {
      name.value = drink.name
      color.value = drink.color
    }
  }

  const update = async () => {
    const error = await updateDrinkLabel(drinkLabelId, name.value, color.value, standardAmount.value)
    if (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      showDangerToast($i18n.t('drinks.update_failure', { name: name.value }))
    } else {
      showSuccessToast($i18n.t('drinks.update_success', { name: name.value }))
      navigateTo('/labels')
    }
  }

  return {
    drinkLabelId,
    name,
    color,
    standardAmount,
    initPage,
    update,
  }
})
