import { useAppState } from './state'
import { useAppGetters } from './getters'
import { useAppActions } from './actions'

export const useAppStore = defineStore('appStore', () => {
  return {
    ...useAppState(),
    ...useAppGetters(),
    ...useAppActions(),
  }
})
