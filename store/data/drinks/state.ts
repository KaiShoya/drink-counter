const drinks = ref<Drink[]>([])

export function useDrinksState () {
  return {
    drinks,
  }
}
