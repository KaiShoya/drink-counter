export function useAppActions () {
  const { isLoading } = useAppState()
  const showLoading = () => isLoading.value = true
  const hideLoading = () => isLoading.value = false

  return {
    showLoading,
    hideLoading,
  }
}
