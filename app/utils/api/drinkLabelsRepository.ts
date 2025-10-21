import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/../database.types'

const TABLE_NAME = 'drink_labels' as const

export type DrinkLabelRow = Database['public']['Tables'][typeof TABLE_NAME]['Row']

export type DrinkLabelWithDefaultColor = DrinkLabelRow & {
  readonly default_color: string
}

export interface DrinkLabelsRepository {
  fetchAll(): Promise<DrinkLabelWithDefaultColor[]>
  deleteById(drinkLabelId: number, name: string): Promise<void>
  updateById(drinkLabelId: number, name: string, color: string | null, standardAmount: number): Promise<void>
  updateVisible(drinkLabelId: number, name: string, visible: boolean): Promise<void>
  updateSort(payload: Array<{ id: number; sort: number }>): Promise<void>
  updateDefaultDrinkId(drinkLabelId: number, defaultDrinkId: number, drinkLabelName: string): Promise<void>
  create(name: string, color: string | null, standardAmount: number): Promise<DrinkLabelWithDefaultColor>
}

export const createDrinkLabelsRepository = (
  client: SupabaseClient<Database>,
): DrinkLabelsRepository => {
  /**
   * drink_labelsテーブルからラベルデータを取得する
   * @return {Promise<DrinkLabelRow[]>}
   */
  const fetchAll = async () => {
    const { data, error } = await client
      .from(TABLE_NAME)
      .select('*')
      .order('sort,id')

    if (error) {
      throw new SupabaseResponseError(error, LOCALE_ERROR_GET_RECORD)
    }

    // デフォルトカラーをランダムセットする（colorがnullの場合に利用）
    return (data ?? []).map<DrinkLabelWithDefaultColor>((label) => ({
      ...label,
      default_color: generateRandomColor(),
    }))
  }

  /**
   * 指定したIDのラベルを削除する
   * 削除に成功したらDrinkLabelsを再取得する
   * @param drinkLabelId number
   * @param name string drinkLabel.name
   */
  const deleteById = async (drinkLabelId: number, name: string) => {
    const { error } = await client
      .from(TABLE_NAME)
      .delete()
      .eq('id', drinkLabelId)

    if (error) {
      throw new SupabaseResponseError(error, LOCALE_DRINKS_DELETE_FAILURE, { name })
    }
  }

  /**
   * 指定したIDのラベルを更新する
   * @param drinkLabelId number
   * @param name string
   * @param color string | null
   */
  const updateById = async (drinkLabelId: number, name: string, color: string | null, standardAmount: number) => {
    const { error } = await client
      .from(TABLE_NAME)
      .update({ name, color, standard_amount: standardAmount })
      .eq('id', drinkLabelId)

    if (error) {
      console.error(error)
      throw new SupabaseResponseError(error, LOCALE_DRINKS_UPDATE_FAILURE, { name })
    }
  }

  /**
   * visibleを更新する
   * @param drinkLabelId number
   * @param name string
   * @param visible boolean
   */
  const updateVisible = async (drinkLabelId: number, name: string, visible: boolean) => {
    const { error } = await client
      .from(TABLE_NAME)
      .update({ visible })
      .eq('id', drinkLabelId)

    if (error) {
      throw new SupabaseResponseError(error, LOCALE_DRINKS_UPDATE_FAILURE, { name })
    }
  }

  /**
   * ソート順を更新する
   * @param drinkLabelId number
   * @param name string
   * @param visible boolean
   */
  const updateSort = async (payload: Array<{ id: number; sort: number }>) => {
    const { error } = await client.rpc('bulk_update_drink_labels_sort', { payload })
    if (error) {
      throw new SupabaseResponseError(error, LOCALE_ERROR_UNKNOWN)
    }
  }

  /**
   * default_drink_idを更新する
   * @param drinkLabelId number
   * @param defaultDrinkId number
   * @param drinkLabelName string エラー通知用
   */
  const updateDefaultDrinkId = async (drinkLabelId: number, defaultDrinkId: number, drinkLabelName: string) => {
    const { error } = await client.from(TABLE_NAME).update({ default_drink_id: defaultDrinkId }).eq('id', drinkLabelId)
    if (error) {
      throw new SupabaseResponseError(error, LOCALE_DRINKS_UPDATE_FAILURE, { name: drinkLabelName })
    }
  }

  /**
   * 新しいラベルを作成する
   * @param name string
   * @param color string | null
   * @param standardAmount number
   * @return {Promise<DrinkLabelRow>}
   */
  const create = async (name: string, color: string | null, standardAmount: number): Promise<DrinkLabelWithDefaultColor> => {
    const { data, error } = await client
      .from(TABLE_NAME)
      .insert({ name, color, standard_amount: standardAmount })
      .select()
      .single()

    if (error) {
      throw new SupabaseResponseError(error, LOCALE_DRINKS_CREATE_FAILURE, { name })
    }

    return {
      ...data,
      default_color: generateRandomColor(),
    } satisfies DrinkLabelWithDefaultColor
  }

  return {
    fetchAll,
    deleteById,
    updateById,
    updateVisible,
    updateSort,
    updateDefaultDrinkId,
    create,
  }
}
