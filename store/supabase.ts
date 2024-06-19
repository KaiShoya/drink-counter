import { createClient, SupabaseClient } from '@supabase/supabase-js'

export const useSupabaseStore = defineStore('supabase', () => {
  const supabase: SupabaseClient = createClient(useRuntimeConfig().public.supabaseUrl, useRuntimeConfig().public.supabaseKey)

  const signUpWithEmail = async (email: string, password: string) => {
    const { data } = await supabase.auth.signUp({ email, password })
    return data
  }
  const signInWithEmail = async (email: string, password: string) => {
    const { data } = await supabase.auth.signInWithPassword({ email, password })
    return data.session
  }

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return {
    supabase,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signOut,
  }
})
