import type { DrinkRow } from '~/repositories/drinksRepository'
import { usePageDrinkLabelEditState } from './state'
import { usePageDrinkLabelEditGetters } from './getters'

export function usePageDrinkLabelEditActions () {
  const { drinkLabelId, name, color, standardAmount, isSaving, hasUnsavedSort, deleteTarget, showDeleteModal } = usePageDrinkLabelEditState()
  const { filteredDrinks } = usePageDrinkLabelEditGetters()
  const { t } = useI18n()
  const localePath = useLocalePath()

  const { findById, updateDrinkLabel } = useDrinkLabelsStore()

  const initPage = async () => {
    const route = useRoute()
    drinkLabelId.value = Number(route.params.id)

    const drinkLabel = findById(drinkLabelId.value)
    if (drinkLabel === undefined) {
      showDangerToast(t(LOCALE_ERROR_GET_RECORD))
      navigateTo(localePath('/labels'))
    } else {
      name.value = drinkLabel.name
      color.value = drinkLabel.color
      standardAmount.value = drinkLabel.standard_amount
    }
  }

  const update = async () => {
    isSaving.value = true
    try {
      await updateDrinkLabel(drinkLabelId.value, name.value, color.value, standardAmount.value)
      showSuccessToast(t(LOCALE_DRINKS_UPDATE_SUCCESS, { name: name.value }))
      navigateTo(localePath('/labels'))
    } finally {
      isSaving.value = false
    }
  }

  const { updateDrinkVisible, updateDrinksSort, deleteDrinkById } = useDrinksStore()

  const updateHidden = async (drink: DrinkRow) => {
    await updateDrinkVisible(drink.id, !drink.visible)
    showSuccessToast(t(LOCALE_DRINKS_UPDATE_VISIBLE_SUCCESS, { name: drink.name, status: t(`drinks.${drink.visible ? 'visible' : 'invisible'}`) }))
  }

  const clickDeleteDrinkButton = (drink: DrinkRow) => {
    deleteTarget.value = drink
    showDeleteModal.value = true
  }

  const deleteDrink = async (drinkId: number | undefined, drinkName: string | undefined) => {
    if (drinkId === undefined || drinkName === undefined) {
      showDeleteModal.value = false
      throw new GetRecordError()
    }
    await deleteDrinkById(drinkId, drinkName).catch((error) => {
      showDeleteModal.value = false
      throw error
    })
    showSuccessToast(t(LOCALE_DRINKS_DELETE_SUCCESS, { name: drinkName }))
    showDeleteModal.value = false
  }

  const onDragEnd = () => { hasUnsavedSort.value = true }

  const saveSort = async () => {
    await updateDrinksSort(filteredDrinks.value)
    hasUnsavedSort.value = false
    showSuccessToast(t(LOCALE_LABELS_SORT_SUCCESS))
  }

  return {
    initPage,
    update,
    isSaving,
    updateHidden,
    clickDeleteDrinkButton,
    deleteDrink,
    onDragEnd,
    saveSort,
  }
}
