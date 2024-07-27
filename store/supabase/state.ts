import { createClient, SupabaseClient } from '@supabase/supabase-js'

export function useSupabaseState () {
  const supabase: SupabaseClient = createClient(useRuntimeConfig().public.supabaseUrl, useRuntimeConfig().public.supabaseKey)

  return {
    supabase,
  }
}
