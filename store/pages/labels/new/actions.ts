export function usePageDrinkLabelNewActions () {
  const { name, color, standardAmount } = usePageDrinkLabelNewState()
  const { $i18n } = useNuxtApp()
  const localePath = useLocalePath()

  const { createDrinkLabel } = useDrinkLabelsStore()

  const initPage = async () => {
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
    initPage,
    create,
  }
}
