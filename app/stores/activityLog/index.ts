import { useActivityLogActions } from './actions'
import { useActivityLogGetters } from './getters'
import { useActivityLogState } from './state'

export const useActivityLogStore = defineStore('activityLogStore', () => {
  return {
    ...useActivityLogState(),
    ...useActivityLogGetters(),
    ...useActivityLogActions(),
  }
})
