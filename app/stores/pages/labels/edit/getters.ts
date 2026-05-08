import { usePageDrinkLabelEditState } from './state'

export function usePageDrinkLabelEditGetters () {
  const { drinkLabelId } = usePageDrinkLabelEditState()
  const { drinks } = useDrinksStore()

  /** 現在のラベルに属する飲み物のみを返す writable computed（draggable の v-model に使用） */
  const filteredDrinks = computed({
    get: () => drinks.filter(d => d.drink_label_id === drinkLabelId.value),
    set: (newOrder) => {
      const ids = new Set(newOrder.map(d => d.id))
      const drinksStore = useDrinksStore()
      drinksStore.drinks = [...drinksStore.drinks.filter(d => !ids.has(d.id)), ...newOrder]
    },
  })

  return {
    filteredDrinks,
  }
}
