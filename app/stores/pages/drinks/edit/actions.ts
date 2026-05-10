import { usePageDrinkEditState } from './state'

export function usePageDrinkEditActions () {
  const { drinkId, name, color, amount, drinkLabelId, isSaving } = usePageDrinkEditState()

  const { t } = useI18n()
  const localePath = useLocalePath()

  const drinksStore = useDrinksStore()
  const { findDrink, updateDrink } = drinksStore

  const initPage = async (targetDrinkId?: number) => {
    const route = useRoute()
    drinkId.value = targetDrinkId ?? Number(route.params.id)

    const drink = findDrink(drinkId.value)
    if (drink === undefined) {
      showDangerToast(t(LOCALE_ERROR_GET_RECORD))
      navigateTo(localePath('/drinks'))
    } else {
      name.value = drink.name
      color.value = drink.color
      amount.value = drink.amount
      drinkLabelId.value = drink.drink_label_id
    }
  }

  const updateDrinkById = async (redirectPath: string | null = '/drinks') => {
    isSaving.value = true
    try {
      await updateDrink(drinkId.value, name.value, color.value, amount.value, drinkLabelId.value)
      showSuccessToast(t(LOCALE_DRINKS_UPDATE_SUCCESS, { name: name.value }))
      if (redirectPath) {
        navigateTo(localePath(redirectPath))
      }
    } finally {
      isSaving.value = false
    }
  }

  return {
    initPage,
    updateDrinkById,
    isSaving,
  }
}
