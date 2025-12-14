import type { DrinkRow as Drink } from '~/repositories/drinksRepository'

const deleteTarget = ref<Drink | null>(null)
const showDeleteModal = ref<boolean>(false)

export function usePageDrinksState () {
  return {
    deleteTarget,
    showDeleteModal,
  }
}
