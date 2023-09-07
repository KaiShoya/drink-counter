import { createClient, SupabaseClient } from '@supabase/supabase-js'

export const useSupabaseStore = defineStore('supabase', () => {
  const supabase = useState<SupabaseClient>('supabase', () => createClient(useRuntimeConfig().public.supabaseUrl, useRuntimeConfig().public.supabaseKey))

  const date: Ref<string> = useState('date', () => '')

  const fetchDate = async () => {
    const { data } = await supabase.value.rpc('get_date')
    const date = data.split(' ')[0]
    date.value = String(date)
  }

  return {
    date,
    supabase: readonly(supabase),
    fetchDate,
  }
})
