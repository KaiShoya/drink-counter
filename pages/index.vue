<script setup lang="ts">
import { useUserStore } from '@/store/userSettings'
const { userSettings } = useUserStore()

const { getDrinks } = useDrinks()
const { getDate, getDrinkCounters, increment, decrement, create } = useDrinkCounters()

// 飲み物リスト
const drinks: Ref<{ [x: string]: any; }[]> = useState('drinks', () => [])
drinks.value = await getDrinks()

// 今日飲んだ杯数
const drinkCount: Ref<number> = useState('drinkCount', () => 0)
// Modal用フラグ
const modalIsActive = useState(() => false)

// 日付
const date = useState(() => '')
date.value = await getDate()

// どの飲み物をどれだけ飲んだか
const drinkCounters: Ref<{ [x: string]: any; }[]> = useState(() => [])
drinkCounters.value = await getDrinkCounters(date.value)

const getCount = (id: number) => {
  const dcs = drinkCounters.value.filter(dc => dc.drink_id === id)
  return {
    id: dcs[0]?.id ?? -1,
    count: Number(dcs[0]?.count ?? 0),
  }
}

const thisDrinkId = useState(() => 0)
const thisCounterId = useState(() => 0)
const plusCheck = (drinkId: number, counterId: number) => {
  thisDrinkId.value = drinkId
  thisCounterId.value = counterId
  // 今飲んでる杯数が閾値を超えてたらアラートを出す
  if (userSettings.thresholdForDetectingOverdrinking <= drinkCount.value) {
    modalIsActive.value = true
  } else {
    plus(drinkId, counterId)
  }
}
const plus = async (drinkId: number, counterId: number) => {
  const drinks: Ref<{ [x: string]: any; }[]> = useState('drinks')
  if (counterId === -1) {
    const data = await create(drinkId, date.value)
    const drink = drinks.value.filter(d => d.id === drinkId)[0]
    drink.counter_id = data[0].id
    drink.count = 1
  } else {
    const data = await increment(counterId)
    drinks.value.filter(d => d.id === drinkId)[0].count = data?.count ?? 0
  }
  // 飲んだ杯数を+1する
  drinkCount.value += 1
}
const minus = async (drinkId: number, counterId: number) => {
  const data = await decrement(counterId)
  drinks.value.filter(d => d.id === drinkId)[0].count = data?.count ?? 0
  // 飲んだ杯数を-1する
  if (drinkCount.value > 0) {
    drinkCount.value -= 1
  }
}

onMounted(
  () => {
    drinkCount.value = 0
    for (const drink of drinks.value) {
      const { id, count } = getCount(drink.id)
      drink.counter_id = id
      drink.count = count
      drinkCount.value += count
    }
  },
)

watch(date, async () => {
  drinkCounters.value = await getDrinkCounters(date.value)
  drinkCount.value = 0
  for (const drink of drinks.value) {
    const { id, count } = getCount(drink.id)
    drink.counter_id = id
    drink.count = count
    drinkCount.value += count
  }
})
</script>

<template>
  <div>
    <input
      v-model="date"
      class="input is-large mt-4 mb-4"
      type="date"
    >
    <AtomsDrinkButton
      v-for="(drink, id) in drinks"
      :id="drink.counter_id"
      :key="id"
      :name="drink.name"
      :drink-id="drink.id"
      :count="drink.count"
      :increment="plusCheck"
      :decrement="minus"
    />
    <AtomsModal
      title="飲みすぎ注意"
      :content="`今日${drinkCount}杯飲んでるけど、まだそれでもまだ飲みますか？`"
      :success="() => { modalIsActive = false; plus(thisDrinkId, thisCounterId) }"
      :cancel="() => modalIsActive = false"
      :class="modalIsActive ? 'is-active' : ''"
    />
  </div>
</template>
