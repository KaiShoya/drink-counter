import { useDrinkLabelsStore } from '~/store/data/drinkLabels'

export const usePageDrinkLabelNewStore = defineStore('pageDrinkLabelNewStore', () => {
  const { $i18n } = useNuxtApp()
  const localePath = useLocalePath()
  const drinkLabelsStore = useDrinkLabelsStore()
  const { fetchDrinkLabels, createDrinkLabel } = drinkLabelsStore

  // 編集対象のドリンク名
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

    name.value = ''
    color.value = generateRandomColor()
    standardAmount.value = 1
  }

  const create = async () => {
    const error = await createDrinkLabel(name.value, color.value, standardAmount.value)
    if (error) {
      showDangerToast($i18n.t(error, { name: name.value }))
    } else {
      showSuccessToast($i18n.t('drinks.create_success', { name: name.value }))
      navigateTo(localePath('/labels'))
    }
  }

  return {
    name,
    color,
    standardAmount,
    initPage,
    create,
  }
})
