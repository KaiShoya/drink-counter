// 削除対象のDrinkデータ
const deleteTarget = ref<DrinkLabel | null>(null)
// 削除モーダル表示フラグ
const showDeleteModal = ref<boolean>(false)

export function usePageDrinkLabelsState () {
  return {
    deleteTarget,
    showDeleteModal,
  }
}
