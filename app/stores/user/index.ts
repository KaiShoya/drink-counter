import { useUserState } from './state'
import { useUserGetters } from './getters'
import { useUserActions } from './actions'

export const useUserStore = defineStore('userStore', () => {
  return {
    ...useUserState(),
    ...useUserGetters(),
    ...useUserActions(),
  }
})
