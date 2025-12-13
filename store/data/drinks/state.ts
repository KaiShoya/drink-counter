import type { DrinkRow } from "~/repositories/drinksRepository"

const drinks = ref<DrinkRow[]>([])

export function useDrinksState () {
  return {
    drinks,
  }
}
