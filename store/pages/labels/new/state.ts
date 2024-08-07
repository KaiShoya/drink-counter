const name = ref<string>('')
const color = ref<string | null>(null)
const standardAmount = ref<number>(1)

export function usePageDrinkLabelNewState () {
  return {
    name,
    color,
    standardAmount,
  }
}
