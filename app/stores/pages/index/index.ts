import { useIndexActions } from './actions'
import { useIndexGetters } from './getters'
import { useIndexState } from './state'

export const useIndexStore = defineStore('indexStore', () => {
  return {
    ...useIndexState(),
    ...useIndexGetters(),
    ...useIndexActions(),
  }
})
