import type { Database } from '~/../database.types'
import { type DrinkLabelsRepository, createDrinkLabelsRepository } from '~/utils/api/drinkLabelsRepository'
import { type DrinkCountersRepository, createDrinkCountersRepository } from '~/utils/api/drinkCountersRepository'
import { type DrinksRepository, createDrinksRepository } from '~/utils/api/drinksRepository'
import { type UserSettingsRepository, createUserSettingsRepository } from '~/utils/api/userSettingsRepository'

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
