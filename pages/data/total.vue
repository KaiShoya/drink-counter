<script setup lang="ts">
const { getDrinks } = useDrinks()
const { getDCAll, quantityByDrink } = useDrinkCounters()

const drinks = await getDrinks()
const drinksIdArray = drinks.map(v => v.id)

const drinkCount = await quantityByDrink()

// 円グラフ用データ
const chartDataTitle = ['Name', 'Count']
const chartDataData: Array<Array<number>> = drinkCount.map(
  (v: { drink_id: number, count: number }) => [
    drinks.filter(drink => drink.id === v.drink_id)[0].name,
    v.count
  ]
)
const chartData: Ref<Array<Array<string | number>>> = useState(() => [chartDataTitle])

// データ更新
chartData.value = [chartDataTitle, ...chartDataData]

const drinkCounters = await getDCAll()
const graphDataData: { [key: string]: Array<number> } = {}
for (const dc of drinkCounters) {
  if (!Object.getOwnPropertyDescriptor(graphDataData, dc.date)) {
    // 配列初期化
    graphDataData[dc.date] = new Array(drinks.length + 1)
    graphDataData[dc.date].fill(0)
  }
  graphDataData[dc.date][drinksIdArray.indexOf(dc.drink_id) + 1] = dc.count
  graphDataData[dc.date][0] += dc.count
}

// カレンダーデータ
const calendarData: Ref<Array<any>> = useState(() => [])
calendarData.value = [
  [
    {
      type: 'date',
      id: 'Date'
    },
    {
      type: 'number',
      id: 'Count'
    }
  ],
  ...Object.entries(graphDataData).map(([key, value]) => [new Date(key), value[0]])
]
</script>

<template>
  <div class="container">
    <AtomsGraphsCalendar :data="calendarData" />
    <AtomsGraphsPieChart :data="chartData" />
    <AtomsTable
      :titles="chartDataTitle"
      :table-data="chartDataData"
    />
  </div>
</template>
