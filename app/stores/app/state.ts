const isLoading = ref<boolean>(false)

export function useAppState () {
  return {
    isLoading,
  }
}
