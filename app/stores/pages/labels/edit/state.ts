const drinkLabelId = ref<number>(0)
const name = ref<string>('')
const color = ref<string | null>(null)
const standardAmount = ref<number>(1)
const isSaving = ref<boolean>(false)

export function usePageDrinkLabelEditState () {
  return {
    drinkLabelId,
    name,
    color,
    standardAmount,
    isSaving,
  }
}
