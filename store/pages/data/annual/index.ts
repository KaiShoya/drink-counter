export const useAnnualStore = defineStore('annualStore', () => {
  return {
    ...useAnnualState(),
    ...useAnnualGetters(),
    ...useAnnualActions(),
  }
})
