import { createClient, SupabaseClient } from '@supabase/supabase-js'
const supabase: SupabaseClient = createClient(useRuntimeConfig().public.supabaseUrl, useRuntimeConfig().public.supabaseKey)

export function useSupabaseState () {
  return {
    supabase,
  }
}
