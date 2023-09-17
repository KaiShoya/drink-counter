import { createClient, SupabaseClient } from '@supabase/supabase-js'

export const useSupabaseStore = defineStore('supabase', () => {
  const supabase = useState<SupabaseClient>('supabase', () => createClient(useRuntimeConfig().public.supabaseUrl, useRuntimeConfig().public.supabaseKey))

  const signUpWithEmail = async (email: string, password: string) => {
    const { data } = await supabase.value.auth.signUp({ email, password })
    return data
  }
  const signInWithEmail = async (email: string, password: string) => {
    const { data } = await supabase.value.auth.signInWithPassword({ email, password })
    return data.session
  }

  const signInWithGoogle = async () => {
    await supabase.value.auth.signInWithOAuth({
      provider: 'google',
    })
  }

  const signOut = async () => {
    await supabase.value.auth.signOut()
  }

  return {
    supabase,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signOut,
  }
})
