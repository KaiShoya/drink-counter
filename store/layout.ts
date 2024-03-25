export const useLayoutStore = defineStore('layout', () => {
  const showQrModal = ref<boolean>(false)

  return {
    showQrModal,
  }
})
