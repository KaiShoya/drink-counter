import { useDrinkLabelsActions } from './actions'
import { useDrinkLabelsGetters } from './getters'
import { useDrinkLabelsState } from './state'

export const useDrinkLabelsStore = defineStore('drinkLabelsStore', () => {
  return {
    ...useDrinkLabelsState(),
    ...useDrinkLabelsGetters(),
    ...useDrinkLabelsActions(),
  }
})
