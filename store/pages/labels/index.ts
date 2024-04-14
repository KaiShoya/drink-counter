import { useDrinkLabelsStore } from '~/store/data/drinkLabels'
import type { DrinkLabel } from '~/store/data/types/drinkLabel'

export const usePageDrinkLabelsStore = defineStore('pageDrinkLabelsStore', () => {
  const { $i18n } = useNuxtApp()
  const drinkLabelsStore = useDrinkLabelsStore()
  const { fetchDrinkLabels, updateDrinkLabelVisible, deleteById, updateDrinkLabelsSort } = drinkLabelsStore

  // 削除対象のDrinkデータ
  const deleteTarget = ref<DrinkLabel | null>(null)
  // 削除モーダル表示フラグ
  const showDeleteModal = ref<boolean>(false)

  const initPage = async () => {
    const error = await fetchDrinkLabels()
    if (error) {
      showDangerToast($i18n.t(error))
    }
  }

  /**
   * ラベルの表示/非表示を切り替える
   * @param drink Drink
   * @returns
   */
  const updateHidden = async (label: DrinkLabel) => {
    const error = await updateDrinkLabelVisible(label.id, !label.visible)
    if (error) {
      showDangerToast($i18n.t(error, { name: label.name }))
      return
    }
    showSuccessToast($i18n.t('drinks.update_visible_success', { name: label.name, status: $i18n.t(`drinks.${label.visible ? 'visible' : 'invisible'}`) }))
  }

  const deleteDrinkLabel = async (drinkLabelId: number | undefined, drinkLabelName: string | undefined) => {
    if (drinkLabelId === undefined || drinkLabelName === undefined) {
      showDangerToast($i18n.t('error.GET_RECORD'))
      showDeleteModal.value = false
      return
    }
    const error = await deleteById(drinkLabelId)
    if (error) {
      showDangerToast($i18n.t(error, { name: drinkLabelName }))
      showDeleteModal.value = false
      return
    }
    showSuccessToast($i18n.t('drinks.delete_success', { name: drinkLabelName }))
    showDeleteModal.value = false
  }

  const clickDeleteDrinkButton = (drinkLabel: DrinkLabel) => {
    deleteTarget.value = drinkLabel
    showDeleteModal.value = true
  }

  const saveSort = async () => {
    const error = await updateDrinkLabelsSort()
    if (error) {
      showDangerToast($i18n.t(error))
      return
    }
    showSuccessToast($i18n.t('drinks.sort_success'))
  }

  return {
    deleteTarget,
    showDeleteModal,
    initPage,
    updateHidden,
    deleteDrinkLabel,
    clickDeleteDrinkButton,
    saveSort,
  }
})
