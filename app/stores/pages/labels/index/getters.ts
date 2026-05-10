export function usePageDrinkLabelsGetters () {
  const { searchQuery } = usePageDrinkLabelsState()
  const { drinkLabels } = storeToRefs(useDrinkLabelsStore())

  const filteredDrinkLabels = computed(() => {
    const q = searchQuery.value.trim().toLowerCase()
    if (!q) return drinkLabels.value
    return drinkLabels.value.filter(l => l.name.toLowerCase().includes(q))
  })

  return { filteredDrinkLabels }
}
