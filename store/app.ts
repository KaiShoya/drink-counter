export const useAppStore = defineStore('appStore', () => {
  const isLoading = ref<boolean>(false)
  const showLoading = () => { isLoading.value = true }
  const hideLoading = () => { isLoading.value = false }
  return {
    isLoading,
    showLoading,
    hideLoading,
  }
})
