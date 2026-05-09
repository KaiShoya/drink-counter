const drinkId = ref<number>(0)
const name = ref<string>('')
const color = ref<string | null>(null)
const amount = ref<number>(1)
const drinkLabelId = ref<number | null>(null)
const isSaving = ref<boolean>(false)

export function usePageDrinkEditState () {
  return {
    drinkId,
    name,
    color,
    amount,
    drinkLabelId,
    isSaving,
  }
}
