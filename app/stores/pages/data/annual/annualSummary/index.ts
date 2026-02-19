import { useAnnualSummaryState } from './state'
import { useAnnualSummaryGetters } from './getters'
import { useAnnualSummaryActions } from './actions'

export const useAnnualSummaryStore = defineStore('pages/index/annualSummary', () => {
  return {
    ...useAnnualSummaryState(),
    ...useAnnualSummaryGetters(),
    ...useAnnualSummaryActions(),
  }
})
