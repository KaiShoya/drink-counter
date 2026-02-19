import { useDrinksActions } from './actions'
import { useDrinksGetters } from './getters'
import { useDrinksState } from './state'

export const useDrinksStore = defineStore('drinksStore', () => {
  return {
    ...useDrinksState(),
    ...useDrinksGetters(),
    ...useDrinksActions(),
  }
})
