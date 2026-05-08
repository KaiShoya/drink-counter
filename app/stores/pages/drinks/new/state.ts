const name = ref<string>('')
const color = ref<string | null>(null)
const amount = ref<number>(1)
const drinkLabelId = ref<number | null>(null)
const isSaving = ref<boolean>(false)

export function usePageDrinkNewState () {
  return {
    name,
    color,
    amount,
    drinkLabelId,
    isSaving,
  }
}
