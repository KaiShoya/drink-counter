export const useMonthlyStore = defineStore('monthlyStore', () => {
  return {
    ...useMonthlyState(),
    ...useMonthlyGetters(),
    ...useMonthlyActions(),
  }
})
