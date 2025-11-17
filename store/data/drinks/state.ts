import type { DrinkRow } from "~/utils/api/drinksRepository"

const drinks = ref<DrinkRow[]>([])

export function useDrinksState () {
  return {
    drinks,
  }
}
