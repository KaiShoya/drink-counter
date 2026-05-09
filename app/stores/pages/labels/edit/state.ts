import type { DrinkRow } from '~/repositories/drinksRepository'

const drinkLabelId = ref<number>(0)
const name = ref<string>('')
const color = ref<string | null>(null)
const standardAmount = ref<number>(1)
const isSaving = ref<boolean>(false)
const hasUnsavedSort = ref<boolean>(false)
const deleteTarget = ref<DrinkRow | null>(null)
const showDeleteModal = ref<boolean>(false)

export function usePageDrinkLabelEditState () {
  return {
    drinkLabelId,
    name,
    color,
    standardAmount,
    isSaving,
    hasUnsavedSort,
    deleteTarget,
    showDeleteModal,
  }
}
