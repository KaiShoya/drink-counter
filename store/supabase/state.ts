import type { Database } from '~/types/database.types'

export function useSupabaseState () {
  const supabase = useSupabaseClient<Database>()

  return {
    supabase,
  }
}
