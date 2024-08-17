export function useDrinkLabelsGetters () {
  const { drinkLabels } = useDrinkLabelsState()
  /**
   * 表示状態のラベルデータを返却する
   */
  const findByVisible = () => drinkLabels.value.filter((label: DrinkLabel) => label.visible)

  /**
   * 指定したIDのラベルデータを取得する
   * @param drinkLabelId number
   * @returns DrinkLabel | undefined
   */
  const findById = (drinkLabelId: number) => drinkLabels.value.find((label: DrinkLabel) => label.id === Number(drinkLabelId))

  // FIXME: 飲み物IDとの比較ができてないためコメントアウト
  // /**
  //  * 指定した飲み物IDのラベルデータを取得する
  //  * @param drinkId number
  //  * @returns Drink | undefined
  //  */
  // const findByDrinkId = (drinkId: number) => drinkLabels.value.filter((label: DrinkLabel) => label.id === Number(drinkId))

  // /**
  //  * drinkLabel.idの配列を返却する
  //  */
  // const getDrinkLabelsIdArray = computed(() => {
  //   return drinkLabels.value.map(d => d.id)
  // })

  // /**
  //  * drinkLabel.nameの配列を返却する
  //  */
  // const getDrinkLabelsNameArray = computed(() => {
  //   return drinkLabels.value.map(d => d.name)
  // })

  return {
    findByVisible,
    findById,
  }
}
