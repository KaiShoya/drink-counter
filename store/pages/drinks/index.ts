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
    await fetchDrinks()
    await fetchDrinkLabels()
  }

  /**
   * 飲み物の表示/非表示を切り替える
   * @param drink Drink
   * @returns
   */
  const updateHidden = async (drink: Drink) => {
    await updateDrinkVisible(drink.id, !drink.visible)
    showSuccessToast($i18n.t(LOCALE_DRINKS_UPDATE_VISIBLE_SUCCESS, { name: drink.name, status: $i18n.t(`drinks.${drink.visible ? 'visible' : 'invisible'}`) }))
  }

  const deleteDrink = async (drinkId: number | undefined, drinkName: string | undefined) => {
    if (drinkId === undefined || drinkName === undefined) {
      showDeleteModal.value = false
      throw new GetRecordError()
    }
    await deleteDrinkById(drinkId, drinkName)
      .catch((error) => {
        showDeleteModal.value = false
        throw error
      })
    showSuccessToast($i18n.t(LOCALE_DRINKS_DELETE_SUCCESS, { name: drinkName }))
    showDeleteModal.value = false
  }

  const clickDeleteDrinkButton = (drink: Drink) => {
    deleteTarget.value = drink
    showDeleteModal.value = true
  }

  const save = async () => {
    await updateDrinksSort()
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
