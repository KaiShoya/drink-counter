import { usePageDrinkNewState } from './state'

export function usePageDrinkNewActions () {
  const { name, color, amount, drinkLabelId, isSaving } = usePageDrinkNewState()

  const { t } = useI18n()
  const localePath = useLocalePath()

  const { createDrink } = useDrinksStore()

  const initPage = async () => {
    name.value = ''
    color.value = generateRandomColor()
    amount.value = 1
    drinkLabelId.value = null
  }

  const create = async () => {
    isSaving.value = true
    try {
      await createDrink(name.value, color.value, amount.value, drinkLabelId.value)
      showSuccessToast(t(LOCALE_DRINKS_CREATE_SUCCESS, { name: name.value }))
      navigateTo(localePath('/drinks'))
    } finally {
      isSaving.value = false
    }
  }

  return {
    initPage,
    create,
    isSaving,
  }
}
