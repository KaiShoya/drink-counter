import { useSupabaseActions } from './actions'
import { useSupabaseGetters } from './getters'
import { useSupabaseState } from './state'

export const useSupabaseStore = defineStore('supabaseStore', () => {
  return {
    ...useSupabaseState(),
    ...useSupabaseGetters(),
    ...useSupabaseActions(),
  }
})
