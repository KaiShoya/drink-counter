import { usePageDrinkLabelEditState } from './state'

export function usePageDrinkLabelEditGetters () {
  const { drinkLabelId } = usePageDrinkLabelEditState()
  const drinksStore = useDrinksStore()
  const { drinks } = storeToRefs(drinksStore)

  /** 現在のラベルに属する飲み物のみを返す writable computed（draggable の v-model に使用） */
  const filteredDrinks = computed({
    get: () => drinks.value.filter(d => d.drink_label_id === drinkLabelId.value),
    set: (newOrder) => {
      const ids = new Set(newOrder.map(d => d.id))
      drinksStore.drinks = [...drinksStore.drinks.filter(d => !ids.has(d.id)), ...newOrder]
    },
  })

  return {
    filteredDrinks,
  }
}
