import { createClient, SupabaseClient } from '@supabase/supabase-js'

export const useSupabaseStore = defineStore('supabase', () => {
  const supabase = useState<SupabaseClient>('supabase', () => createClient(useRuntimeConfig().public.supabaseUrl, useRuntimeConfig().public.supabaseKey))

  return {
    supabase: readonly(supabase),
  }
})
