import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'

const TABLE_NAME = 'user_settings' as const

export type UserSettingsRow = {
  threshold_for_detecting_overdrinking: number
  timezone: string
  switching_timing: number
}

export interface UserSettingsRepository {
  fetchUserSettings(): Promise<UserSettingsRow | null>
  updateUserSettings(threshold: number, tz: string, timing: number): Promise<void>
}

export const createUserSettingsRepository = (
  client: SupabaseClient<Database>,
): UserSettingsRepository => {
  /**
   * ユーザー設定を取得する
   * @returns Promise<UserSettingsRow | null>
   */
  const fetchUserSettings = async (): Promise<UserSettingsRow | null> => {
    const { data, error } = await client.rpc('get_user_settings')

    if (error) {
      throw new SupabaseResponseError(error, LOCALE_ERROR_GET_RECORD)
    }

    return data[0] ?? null
  }

  /**
   * ユーザー設定を更新する
   * @param threshold number
   * @param tz string
   * @param timing number
   */
  const updateUserSettings = async (threshold: number, tz: string, timing: number) => {
    const { error } = await client.rpc('update_user_settings', {
      threshold,
      tz,
      timing,
    })
    if (error) {
      throw new SupabaseResponseError(error, LOCALE_ERROR_UNKNOWN)
    }
  }

  return {
    fetchUserSettings,
    updateUserSettings,
  }
}
