const isLoading = ref<boolean>(false)
const isInitialized = ref<boolean>(false)

export function useAppState () {
  async function initializeStore () {
    // init
  }

  return {
    isLoading,
    isInitialized,
    initializeStore,
  }
}
