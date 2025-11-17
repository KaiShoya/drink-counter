export function usePageDrinkNewGetters () {
  const getDrinkLabels = computed(() => {
    const { drinkLabels } = storeToRefs(useDrinkLabelsStore())
    return drinkLabels.value
  })
  return {
    getDrinkLabels,
  }
}
