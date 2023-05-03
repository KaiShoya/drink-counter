<script setup lang="ts">
const { getDrinks } = useDrinks()
const { getDCPerMonth, quantityByDrinkPerMonth } = useDrinkCounters()

const date = new Date()
const yearMonth = useState(() => `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}`)
// カレンダー再描画用
const updateCalendar = ref(0)

const drinks = await getDrinks()
const drinksIdArray = drinks.map(v => v.id)
const drinksArray = drinks.map(v => v.name)

const drinkCounters: Ref<{ [x: string]: any }[]> = useState(() => [])

// 円グラフ用のデータをセットする
const chartDataTitle = ['Name', 'Count']
let chartDataData: Array<Array<number>> = []
const chartData: Ref<Array<Array<string | number>>> = useState(() => [chartDataTitle])

// 棒グラフ用のデータをセットする
const graphDataTitle = ['日付', '合計', ...drinksArray]
let graphDataData: { [key: string]: Array<number> } = {}
const graphData: Ref<Array<Array<string | number>>> = useState(() => [graphDataTitle])

const resetPieChartData = async (year: number, month: number) => {
  const drinkCount = await quantityByDrinkPerMonth(year, month)

  chartDataData = drinkCount.map(
    (v: { drink_id: number, count: number }) => [
      drinks.filter(drink => drink.id === v.drink_id)[0].name,
      v.count
    ]
  )

  // データ更新
  chartData.value = [chartDataTitle, ...chartDataData]
}

const resetGraphData = () => {
  graphDataData = {}

  for (const dc of drinkCounters.value) {
    if (!Object.getOwnPropertyDescriptor(graphDataData, dc.date)) {
      // 配列初期化
      graphDataData[dc.date] = new Array(drinksIdArray.length + 1)
      graphDataData[dc.date].fill(0)
    }
    graphDataData[dc.date][drinksIdArray.indexOf(dc.drink_id) + 1] = dc.count
    graphDataData[dc.date][0] += dc.count
  }
  graphData.value = [
    graphDataTitle,
    ...Object.entries(graphDataData).map(([key, value]) => [key as string | Number].concat(value))
  ]
}

const calendarData: Ref<Array<any>> = useState(() => [])
const resetPerWODData = () => {
  calendarData.value = Object.entries(graphDataData).map(([key, value]) => {
    return {
      date: key,
      count: value[0]
    }
  })
}

const setChartData = async () => {
  // input monthをyearとmonthに分離
  const [year, month] = yearMonth.value.split('-').map(v => Number(v))
  drinkCounters.value = await getDCPerMonth(year, month)

  await resetPieChartData(year, month)
  await resetGraphData()
  resetPerWODData()
  // keyを更新してカレンダーを再描画
  updateCalendar.value++
}

// 初期化
await setChartData()
</script>

<template>
  <div class="container">
    <input
      v-model="yearMonth"
      class="input"
      type="month"
      @change="setChartData"
    >
    <AtomsGraphsFCalendar
      :key="updateCalendar"
      :year-month="yearMonth"
      :data="calendarData"
    />
    <AtomsGraphsComboChart :data="graphData" />
    <AtomsGraphsPieChart :data="chartData" />
    <AtomsTable
      :titles="chartDataTitle"
      :table-data="chartDataData"
    />
  </div>
</template>
