export function usePageDrinkEditGetters () {
  const getDrinkLabels = computed(() => {
    const { drinkLabels } = storeToRefs(useDrinkLabelsStore())
    return drinkLabels.value
  })
  return {
    getDrinkLabels,
  }
}
