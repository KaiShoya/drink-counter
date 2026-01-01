import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'

const TABLE_NAME = 'drinks' as const

export type DrinkRow = Database['public']['Tables'][typeof TABLE_NAME]['Row'] & {
  readonly default_color: string
}

export interface DrinksRepository {
  fetchAll(): Promise<DrinkRow[]>
  fetchById(id: number): Promise<DrinkRow | null>
  fetchByLabel(drinkLabelId: number | null): Promise<DrinkRow[]>
  deleteById(drinkId: number, name: string): Promise<void>
  updateById(drinkId: number, name: string, color: string | null, amount: number, drinkLabelId: number | null): Promise<void>
  updateVisible(drinkId: number, name: string, visible: boolean): Promise<void>
  updateSort(payload: Array<{ id: number; sort: number }>): Promise<void>
  updatePositionsForLabel(drinkLabelId: number | null, payload: Array<{ id: number; sort: number }>): Promise<void>
  create(name: string, color: string | null, amount: number, drinkLabelId: number | null): Promise<DrinkRow>
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
   * Drinksテーブルから指定したIDの飲み物のデータを取得する
   * @return {Promise<DrinkRow | null>}
   */
  const fetchById = async (id: number): Promise<DrinkRow | null> => {
    const { data, error } = await client
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw new SupabaseResponseError(error, LOCALE_ERROR_GET_RECORD)
    }

    // デフォルトカラーをランダムセットする（colorがnullの場合に利用）
    // dataがnullの場合はnullを返す
    return data && {
      ...data,
      default_color: generateRandomColor(),
    }
  }

  /**
   * 指定したラベルに紐づく飲み物を取得する
   * ラベルは null を許容（ラベル未設定の飲み物）
   */
  const fetchByLabel = async (drinkLabelId: number | null): Promise<DrinkRow[]> => {
    let query = client.from(TABLE_NAME).select('*')
    if (drinkLabelId === null) {
      query = query.is('drink_label_id', null)
    } else {
      query = query.eq('drink_label_id', drinkLabelId)
    }
    const { data, error } = await query.order('sort,id')

    if (error) {
      throw new SupabaseResponseError(error, LOCALE_ERROR_GET_RECORD)
    }

    return (data ?? []).map((drink) => ({
      ...drink,
      default_color: generateRandomColor(),
    }))
  }

  /**
   * 指定したIDの飲み物を削除する
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

  /**
   * 指定ラベル内の飲み物の sort を更新する（ユーザーは RLS で制限される想定）
   * payload: [{ id, sort }, ...]
   */
  const updatePositionsForLabel = async (drinkLabelId: number | null, payload: Array<{ id: number; sort: number }>) => {
    // 安全のため、drink_label_id が一致する行のみ更新する
    // 個別更新を行う（bulk RPC が存在するがラベルスコープを保証するためここで処理）
    for (const p of payload) {
      const { error } = await client
        .from(TABLE_NAME)
        .update({ sort: p.sort })
        .eq('id', p.id)
        .eq('drink_label_id', drinkLabelId)

      if (error) {
        throw new SupabaseResponseError(error, LOCALE_ERROR_UNKNOWN)
      }
    }
  }

  const create = async (name: string, color: string | null, amount: number, drinkLabelId: number | null) => {
    const { data, error } = await client.from(TABLE_NAME).insert({ name, color, amount, drink_label_id: drinkLabelId }).select().single()
    if (error) {
      throw new SupabaseResponseError(error, LOCALE_DRINKS_CREATE_FAILURE, { name })
    }
    return {
      ...data,
      default_color: generateRandomColor(),
    }
  }

  return {
    fetchAll,
    fetchById,
    fetchByLabel,
    deleteById,
    updateById,
    updateVisible,
    updateSort,
    updatePositionsForLabel,
    create,
  }
}
