import type { Database } from '~/database.types'

export function useSupabaseState () {
  const supabase = useSupabaseClient<Database>()

  return {
    supabase,
  }
}
