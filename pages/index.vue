<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserSettingsStore } from '@/store/data/userSettings'
import { useIndexStore } from '@/store/pages/index'

const { userSettings } = storeToRefs(useUserSettingsStore())

const indexStore = useIndexStore()
const { date, numberOfDrinks, drinkCountForDay, isLoading } = storeToRefs(indexStore)
const { fetchNumberOfDrinks, fetchDate, prevDate, nextDate, plus, minus } = indexStore

// Modal用フラグ
const modalIsActive = useState(() => false)

// 日付
await fetchDate()

// numberOfDrinksにデータをセット
await fetchNumberOfDrinks(date.value)

const thisDrinkId = useState(() => 0)
const thisCounterId = useState(() => 0)
// 杯数加算時の閾値チェック
const plusCheck = (drinkId: number, counterId: number) => {
  thisDrinkId.value = drinkId
  thisCounterId.value = counterId
  // 今飲んでる杯数が閾値を超えてたらアラートを出す
  if (userSettings.value.thresholdForDetectingOverdrinking <= drinkCountForDay.value) {
    modalIsActive.value = true
  } else {
    plus(drinkId, counterId)
  }
}

watch(date, async () => {
  await fetchNumberOfDrinks(date.value)
})
</script>

<template>
  <div>
    <div class="columns is-mobile my-4 mx-0">
      <button
        class="column is-2 button is-large"
        @click="prevDate"
      >
        &lt;
      </button>
      <input
        v-model="date"
        class="column input is-large mx-2"
        type="date"
      >
      <button
        class="column is-2 button is-large"
        @click="nextDate"
      >
        &gt;
      </button>
    </div>

    <o-loading v-model:active="isLoading" />

    <div v-if="!isLoading">
      <PagesIndexDrinkColumn
        v-for="(drink, id) in numberOfDrinks"
        :key="id"
        :drink-id="drink.id"
        :name="drink.name"
        :count="drink.count"
        :drink-counter-id="drink.drinkCounterId"
        :increment="plusCheck"
        :decrement="minus"
      />
    </div>

    <ShareWarningModal
      title="飲みすぎ注意"
      :content="`今日${drinkCountForDay}杯飲んでるけど、まだそれでもまだ飲みますか？`"
      :success="() => { modalIsActive = false; plus(thisDrinkId, thisCounterId) }"
      :cancel="() => modalIsActive = false"
      :class="modalIsActive ? 'is-active' : ''"
    />
  </div>
</template>
