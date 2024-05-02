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
    await fetchDrinkLabels()

    name.value = ''
    color.value = generateRandomColor()
    standardAmount.value = 1
  }

  const create = async () => {
    await createDrinkLabel(name.value, color.value, standardAmount.value)
    showSuccessToast($i18n.t(LOCALE_DRINKS_CREATE_SUCCESS, { name: name.value }))
    navigateTo(localePath('/labels'))
  }

  return {
    name,
    color,
    standardAmount,
    initPage,
    create,
  }
})
