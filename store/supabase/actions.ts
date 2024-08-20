export function useSupabaseActions () {
  const { supabase } = useSupabaseState()

  const signUpWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      throw new SupabaseAuthError(error)
    }
    return data
  }

  const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      throw new SupabaseAuthError(error)
    }
    return data.session
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: useRuntimeConfig().public.baseUrl + '/confirm',
      },
    })

    if (error) {
      throw new SupabaseAuthError(error)
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw new SupabaseAuthError(error)
    }
  }

  return {
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signOut,
  }
}
