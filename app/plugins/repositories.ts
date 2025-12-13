import type { Database } from '~/types/database.types'
import { type DrinkLabelsRepository, createDrinkLabelsRepository } from '~/repositories/drinkLabelsRepository'
import { type DrinkCountersRepository, createDrinkCountersRepository } from '~/repositories/drinkCountersRepository'
import { type DrinksRepository, createDrinksRepository } from '~/repositories/drinksRepository'
import { type UserSettingsRepository, createUserSettingsRepository } from '~/repositories/userSettingsRepository'

export default defineNuxtPlugin(() => {
  const supabase = useSupabaseClient<Database>()

  const drinkCountersRepository = createDrinkCountersRepository(supabase)
  const drinksRepository = createDrinksRepository(supabase)
  const drinkLabelsRepository = createDrinkLabelsRepository(supabase)
  const userSettingsRepository = createUserSettingsRepository(supabase)

  return {
    provide: {
      drinkCountersRepository,
      drinksRepository,
      drinkLabelsRepository,
      userSettingsRepository,
    },
  }
})

declare module '#app' {
  interface NuxtApp {
    $drinkCountersRepository: DrinkCountersRepository
    $drinksRepository: DrinksRepository
    $drinkLabelsRepository: DrinkLabelsRepository
    $userSettingsRepository: UserSettingsRepository
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $drinkCountersRepository: DrinkCountersRepository
    $drinksRepository: DrinksRepository
    $drinkLabelsRepository: DrinkLabelsRepository
    $userSettingsRepository: UserSettingsRepository
  }
}
