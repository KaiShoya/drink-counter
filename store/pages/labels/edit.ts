import { useDrinkLabelsStore } from '~/store/data/drinkLabels'

export const usePageDrinkLabelEditStore = defineStore('pageDrinkLabelEditStore', () => {
  const { $i18n } = useNuxtApp()
  const localePath = useLocalePath()
  const drinkLabelsStore = useDrinkLabelsStore()
  const { fetchDrinkLabels, findById, updateDrinkLabel } = drinkLabelsStore

  // 編集対象のラベルID
  const drinkLabelId = ref<number>(0)

  // 編集対象のラベル名
  const name = ref<string>('')
  // 編集対象の色
  const color = ref<string | null>(null)
  // 標準の量
  const standardAmount = ref<number>(1)

  const initPage = async () => {
    const route = useRoute()
    drinkLabelId.value = Number(route.params.id)
    await fetchDrinkLabels()

    const drinkLabel = findById(drinkLabelId.value)
    if (drinkLabel === undefined) {
      showDangerToast($i18n.t(LOCALE_ERROR_GET_RECORD))
      navigateTo(localePath('/labels'))
    } else {
      name.value = drinkLabel.name
      color.value = drinkLabel.color
      standardAmount.value = drinkLabel.standard_amount
    }
  }

  const update = async () => {
    await updateDrinkLabel(drinkLabelId.value, name.value, color.value, standardAmount.value)
    showSuccessToast($i18n.t(LOCALE_DRINKS_UPDATE_SUCCESS, { name: name.value }))
    navigateTo(localePath('/labels'))
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
