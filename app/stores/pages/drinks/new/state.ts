const name = ref<string>('')
const color = ref<string | null>(null)
const amount = ref<number>(1)
const drinkLabelId = ref<number | null>(null)

export function usePageDrinkNewState () {
  return {
    name,
    color,
    amount,
    drinkLabelId,
  }
}
