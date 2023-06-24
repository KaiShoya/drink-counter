import { createClient } from '@supabase/supabase-js'

export const supabase = () => {
  return createClient(useRuntimeConfig().public.supabaseUrl, useRuntimeConfig().public.supabaseKey)
}

export const useSupabase = () => {
  const supabase = createClient(useRuntimeConfig().public.supabaseUrl, useRuntimeConfig().public.supabaseKey)
  const isSignin = async () => {
    const { data } = await supabase.auth.getSession()
    return data.session !== null
  }

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
      provider: 'google'
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return {
    supabase: readonly(supabase),
    isSignin: readonly(isSignin),
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signOut
  }
}

export const useDrinks = () => {
  const { supabase } = useSupabase()
  const getDrinks = async () => {
    const { data } = await supabase.from('drinks').select('*')
    return data || []
  }
  return {
    getDrinks
  }
}

export const useDrinkCounters = () => {
  const { supabase } = useSupabase()
  const getDCAll = async () => {
    const { data } = await supabase.from('drink_counters').select('*').order('date,drink_id').gt('count', 0)
    return data || []
  }
  const getDCPerMonth = async (year: number, month: number) => {
    const { data } = await supabase.from('drink_counters').select('*').order('date,drink_id').gt('count', 0).gte('date', `${year}-${month}-01`).lt('date', `${year}-${month + 1}-01`)
    return data || []
  }
  const getDrinkCounters = async (date: string) => {
    const { data } = await supabase.from('drink_counters').select('*').eq('date', date)
    return data || []
  }
  const getDate = async () => {
    const { data } = await supabase.rpc('get_date')
    const date = data.split(' ')[0]
    return String(date)
  }

  const increment = async (id: number) => {
    const { data } = await supabase.rpc('increment', { row_id: id })
    return data
  }
  const decrement = async (id: number) => {
    const { data } = await supabase.rpc('decrement', { row_id: id })
    return data
  }
  const create = async (drinkId: number, date = 'now()') => {
    const { data } = await supabase.from('drink_counters').insert({ date, drink_id: drinkId, count: 1 }).select()
    return data || []
  }

  const quantityByDrink = async () => {
    const { data } = await supabase.rpc('sum_count')
    return data || []
  }
  const quantityByDrinkPerMonth = async (year: number, month: number) => {
    const { data } = await supabase.rpc('sum_count_per_month', { year, month })
    return data || 0
  }

  return {
    getDCAll,
    getDCPerMonth,
    getDrinkCounters,
    increment,
    decrement,
    create,
    getDate,
    quantityByDrink,
    quantityByDrinkPerMonth
  }
}

export const useDrinkAlert = () => {
  const drinkAlertThreshold: Ref<number> = useState(() => 2)
  return {
    drinkAlertThreshold
  }
}

export const useUserSettings = () => {
  const { supabase } = useSupabase()
  const getUserSettings = async () => {
    const { data } = await supabase.rpc('get_user_settings')
    return (data || { threshold_for_detecting_overdrinking: 2 })
  }

  const updateThresholdForDetectingOverdrinking = async (threshold: number) => {
    await supabase.rpc('update_threshold_for_detecting_overdrinking', { threshold })
  }
  return {
    getUserSettings,
    updateThresholdForDetectingOverdrinking
  }
}
