import { useDrinksStore } from '~/store/data/drinks'
import type { Drink } from '~/store/data/types/drink'
import { useDrinkLabelsStore } from '~/store/data/drinkLabels'

export const usePageDrinksStore = defineStore('pageDrinksStore', () => {
  const { $i18n } = useNuxtApp()
  const drinksStore = useDrinksStore()
  const { fetchDrinks, updateDrinkVisible, updateDrinksSort, deleteDrinkById } = drinksStore
  const drinkLabelsStore = useDrinkLabelsStore()
  const { fetchDrinkLabels } = drinkLabelsStore

  // 削除対象のDrinkデータ
  const deleteTarget = ref<Drink | null>(null)
  // 削除モーダル表示フラグ
  const showDeleteModal = ref<boolean>(false)

  const initPage = async () => {
    let error = await fetchDrinks()
    if (error) {
      showDangerToast($i18n.t(error))
    }
    error = await fetchDrinkLabels()
    if (error) {
      showDangerToast($i18n.t(error))
    }
  }

  /**
   * 飲み物の表示/非表示を切り替える
   * @param drink Drink
   * @returns
   */
  const updateHidden = async (drink: Drink) => {
    const error = await updateDrinkVisible(drink.id, !drink.visible)
    if (error) {
      showDangerToast($i18n.t(error, { name: drink.name }))
      return
    }
    showSuccessToast($i18n.t(LOCALE_DRINKS_UPDATE_VISIBLE_SUCCESS, { name: drink.name, status: $i18n.t(`drinks.${drink.visible ? 'visible' : 'invisible'}`) }))
  }

  const deleteDrink = async (drinkId: number | undefined, drinkName: string | undefined) => {
    if (drinkId === undefined || drinkName === undefined) {
      showDangerToast($i18n.t(LOCALE_ERROR_GET_RECORD))
      showDeleteModal.value = false
      return
    }
    const error = await deleteDrinkById(drinkId)
    if (error) {
      showDangerToast($i18n.t(error, { name: drinkName }))
      showDeleteModal.value = false
      return
    }
    showSuccessToast($i18n.t(LOCALE_DRINKS_DELETE_SUCCESS, { name: drinkName }))
    showDeleteModal.value = false
  }

  const clickDeleteDrinkButton = (drink: Drink) => {
    deleteTarget.value = drink
    showDeleteModal.value = true
  }

  const save = async () => {
    const error = await updateDrinksSort()
    if (error) {
      showDangerToast($i18n.t(error))
      return
    }
    showSuccessToast($i18n.t(LOCALE_DRINKS_SORT_SUCCESS))
  }

  return {
    deleteTarget,
    showDeleteModal,
    initPage,
    updateHidden,
    deleteDrink,
    clickDeleteDrinkButton,
    save,
  }
})
