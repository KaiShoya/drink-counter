import type { DrinkRow as Drink } from '~/repositories/drinksRepository'

const deleteTarget = ref<Drink | null>(null)
const showDeleteModal = ref<boolean>(false)
// ドラッグ並び替え後に未保存の状態を追跡する
const hasUnsavedSort = ref<boolean>(false)

export function usePageDrinksState () {
  return {
    deleteTarget,
    showDeleteModal,
    hasUnsavedSort,
  }
}
