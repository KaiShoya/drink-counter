const TABLE_NAME = 'drink_labels'

export function useDrinkLabelsActions () {
  const { supabase } = useSupabaseStore()
  const { drinkLabels } = useDrinkLabelsState()
  const { findById } = useDrinkLabelsGetters()

  /**
   * drink_labelsテーブルからラベルデータを取得する
   * @returns Promise<error_message_code | undefined>
   */
  const fetchDrinkLabels = async () => {
    const { data, error } = await supabase.from(TABLE_NAME).select('*').order('sort,id')
    if (error) {
      throw new Response500Error()
    }
    drinkLabels.value = []

    // デフォルトカラーをランダムセットする
    for (const label of data) {
      drinkLabels.value.push({
        ...label,
        default_color: generateRandomColor(),
      })
    }
  }

  /**
   * 指定したIDのラベルを削除する
   * 削除に成功したらDrinkLabelsを再取得する
   * @param drinkLabelId number
   * @param name string drinkLabel.name
   * @returns Promise<error_message_code | undefined>
   */
  const deleteById = async (drinkLabelId: number, name: string) => {
    const { error } = await supabase.from(TABLE_NAME).delete().eq('id', drinkLabelId)
    if (error) {
      throw new SupabaseResponseError(LOCALE_DRINKS_DELETE_FAILURE, { name })
    }

    await fetchDrinkLabels()
  }

  /**
   * 指定したIDのラベルを更新する
   * @param drinkLabelId number
   * @param name string
   * @param color string | null
   * @returns Promise<error_message_code | undefined>
   */
  const updateDrinkLabel = async (drinkLabelId: number, name: string, color: string | null, standardAmount: number) => {
    const { error } = await supabase.from(TABLE_NAME).update({ name, color, standard_amount: standardAmount }).eq('id', drinkLabelId)
    if (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      throw new SupabaseResponseError(LOCALE_DRINKS_UPDATE_FAILURE, { name })
    }
    const drinkLabel = findById(drinkLabelId)
    if (drinkLabel) {
      drinkLabel.name = name
      drinkLabel.color = color
    }
  }

  const updateDrinkLabelVisible = async (drinkLabelId: number, name: string, visible: boolean) => {
    const { error } = await supabase.from(TABLE_NAME).update({ visible }).eq('id', drinkLabelId)
    if (error) {
      throw new SupabaseResponseError(LOCALE_DRINKS_UPDATE_FAILURE, { name })
    }
    const drinkLabel = findById(drinkLabelId)
    if (drinkLabel) {
      drinkLabel.visible = visible
    }
  }

  const updateDrinkLabelsSort = async () => {
    const payload = drinkLabels.value.map((label, i) => {
      label.sort = i
      return {
        id: label.id,
        sort: label.sort,
      }
    })
    const { error } = await supabase.rpc('bulk_update_drink_labels_sort', { payload })
    if (error) {
      throw new Response500Error()
    }
  }

  const updateDefaultDrinkId = async (drinkLabelId: number, defaultDrinkId: number, drinkLabelName: string) => {
    const { error } = await supabase.from(TABLE_NAME).update({ default_drink_id: defaultDrinkId }).eq('id', drinkLabelId)
    if (error) {
      const instance = new Response500Error()
      instance.setAppendString(`: ${drinkLabelName}`)
      throw instance
    }
  }

  const createDrinkLabel = async (name: string, color: string | null, standardAmount: number) => {
    const { error } = await supabase.from(TABLE_NAME).insert({ name, color, standard_amount: standardAmount })
    if (error) {
      throw new SupabaseResponseError(LOCALE_DRINKS_CREATE_FAILURE, { name })
    }
    await fetchDrinkLabels()
  }

  return {
    fetchDrinkLabels,
    deleteById,
    updateDrinkLabel,
    updateDrinkLabelVisible,
    updateDrinkLabelsSort,
    updateDefaultDrinkId,
    createDrinkLabel,
  }
}
