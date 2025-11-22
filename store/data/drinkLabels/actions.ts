const TABLE_NAME = 'drink_labels'

export function useDrinkLabelsActions () {
  const { drinkLabels } = useDrinkLabelsState()
  const { findById } = useDrinkLabelsGetters()

  const { $drinkLabelsRepository } = useNuxtApp()

  /**
   * drink_labelsテーブルからラベルデータを取得する
   * @returns Promise<error_message_code | undefined>
   */
  const fetchDrinkLabels = async () => {
    drinkLabels.value = await $drinkLabelsRepository.fetchAll()
  }

  /**
   * 指定したIDのラベルを削除する
   * 削除に成功したらDrinkLabelsを再取得する
   * @param drinkLabelId number
   * @param name string drinkLabel.name
   * @returns Promise<error_message_code | undefined>
   */
  const deleteById = async (drinkLabelId: number, name: string) => {
    await $drinkLabelsRepository.deleteById(drinkLabelId, name)
    drinkLabels.value = drinkLabels.value.filter(dl => dl.id !== drinkLabelId)
  }

  /**
   * 指定したIDのラベルを更新する
   * @param drinkLabelId number
   * @param name string
   * @param color string | null
   * @returns Promise<error_message_code | undefined>
   */
  const updateDrinkLabel = async (drinkLabelId: number, name: string, color: string | null, standardAmount: number) => {
    const drinkLabel = findById(drinkLabelId)
    if (!drinkLabel) {
      throw new GetRecordError()
    }
    await $drinkLabelsRepository.updateById(drinkLabelId, name, color, standardAmount)
    drinkLabel.name = name
    drinkLabel.color = color
    drinkLabel.standard_amount = standardAmount
  }

  const updateDrinkLabelVisible = async (drinkLabelId: number, name: string, visible: boolean) => {
    const drinkLabel = findById(drinkLabelId)
    if (!drinkLabel) {
      throw new GetRecordError()
    }
    await $drinkLabelsRepository.updateVisible(drinkLabelId, name, visible)
    drinkLabel.visible = visible
  }

  const updateDrinkLabelsSort = async () => {
    const payload = drinkLabels.value.map((label, i) => {
      label.sort = i
      return {
        id: label.id,
        sort: label.sort,
      }
    })
    await $drinkLabelsRepository.updateSort(payload)
  }

  const updateDefaultDrinkId = async (drinkLabelId: number, defaultDrinkId: number, drinkLabelName: string) => {
    const drinkLabel = findById(drinkLabelId)
    if (!drinkLabel) {
      throw new GetRecordError()
    }
    await $drinkLabelsRepository.updateDefaultDrinkId(drinkLabelId, defaultDrinkId, drinkLabelName)
    drinkLabel.default_drink_id = defaultDrinkId
  }

  const createDrinkLabel = async (name: string, color: string | null, standardAmount: number) => {
    const drinkLabel = await $drinkLabelsRepository.create(name, color, standardAmount)
    drinkLabels.value.push(drinkLabel)
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
