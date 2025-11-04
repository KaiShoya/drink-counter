import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'

const TABLE_NAME = 'drinks' as const

export type DrinkRow = Database['public']['Tables'][typeof TABLE_NAME]['Row'] & {
  readonly default_color: string
}

export interface DrinksRepository {
  fetchAll(): Promise<DrinkRow[]>
  deleteById(drinkId: number, name: string): Promise<void>
  updateById(drinkId: number, name: string, color: string | null, amount: number, drinkLabelId: number | null): Promise<void>
  updateVisible(drinkId: number, name: string, visible: boolean): Promise<void>
  updateSort(payload: Array<{ id: number; sort: number }>): Promise<void>
  create(name: string, color: string | null, amount: number, drinkLabelId: number | null): Promise<void>
}

export const createDrinksRepository = (
  client: SupabaseClient<Database>,
): DrinksRepository => {
  /**
   * Drinksテーブルから飲み物のデータを取得する
   * @return {Promise<DrinkRow[]>}
   */
  const fetchAll = async (): Promise<DrinkRow[]> => {
    const { data, error } = await client
      .from(TABLE_NAME)
      .select('*')
      .order('sort,id')

    if (error) {
      throw new SupabaseResponseError(error, LOCALE_ERROR_GET_RECORD)
    }

    // デフォルトカラーをランダムセットする（colorがnullの場合に利用）
    return (data ?? []).map((drink) => ({
      ...drink,
      default_color: generateRandomColor(),
    }))
  }

  /**
   * 指定したIDの飲み物を削除する
   * 削除に成功したらDrinksを再取得する
   * @param drinkId number
   * @param name string
   */
  const deleteById = async (drinkId: number, name: string) => {
    const { error } = await client.rpc('delete_drink_data', { drinkid: drinkId })

    if (error) {
      throw new SupabaseResponseError(error, LOCALE_DRINKS_DELETE_FAILURE, { name })
    }
  }

  /**
   * 指定したIDの飲み物を更新する
   * @param drinkId number
   * @param name string
   * @param color string | null
   * @param amount number
   * @param drinkLabelId number | null
   */
  const updateById = async (drinkId: number, name: string, color: string | null, amount: number, drinkLabelId: number | null) => {
    const { error } = await client
      .from(TABLE_NAME)
      .update({ name, color, amount, drink_label_id: drinkLabelId })
      .eq('id', drinkId)

    if (error) {
      throw new SupabaseResponseError(error, LOCALE_DRINKS_UPDATE_FAILURE, { name })
    }
  }

  /**
   * 指定したIDの飲み物の表示・非表示を更新する
   * @param drinkId number
   * @param name string
   * @param visible boolean
   */
  const updateVisible = async (drinkId: number, name: string, visible: boolean) => {
    const { error } = await client
      .from(TABLE_NAME)
      .update({ visible })
      .eq('id', drinkId)

    if (error) {
      throw new SupabaseResponseError(error, LOCALE_DRINKS_UPDATE_FAILURE, { name })
    }
  }

  /**
   * ソート順を更新する
   */
  const updateSort = async (payload: Array<{ id: number; sort: number }>) => {
    const { error } = await client.rpc('bulk_update_drinks_sort', { payload })
    if (error) {
      throw new SupabaseResponseError(error, LOCALE_ERROR_UNKNOWN)
    }
  }

  const create = async (name: string, color: string | null, amount: number, drinkLabelId: number | null) => {
    const { error } = await client.from(TABLE_NAME).insert({ name, color, amount, drink_label_id: drinkLabelId })
    if (error) {
      throw new SupabaseResponseError(error, LOCALE_DRINKS_CREATE_FAILURE, { name })
    }
    await fetchAll()
  }
  return {
    fetchAll,
    deleteById,
    updateById,
    updateVisible,
    updateSort,
    create,
  }
}
