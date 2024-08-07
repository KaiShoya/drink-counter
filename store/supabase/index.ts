export const useSupabaseStore = defineStore('supabaseStore', () => {
  return {
    ...useSupabaseState(),
    ...useSupabaseGetters(),
    ...useSupabaseActions(),
  }
})
