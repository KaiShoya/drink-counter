<script setup lang="ts">
const { $i18n } = useNuxtApp()
useSeoMeta({
  title: $i18n.t(LOCALE_ROUTES_TOP),
})

const { userSettings } = storeToRefs(useUserSettingsStore())

const indexStore = useIndexStore()
const { date, labelsWithDrinks, drinkCountForDay } = storeToRefs(indexStore)
const { fetchNumberOfDrinks, fetchDate, plus, minus, updateDefaultDrink } = indexStore

// Modal用フラグ
const modalIsActive = ref<boolean>(false)

// 日付
fetchDate()

// numberOfDrinksにデータをセット
fetchNumberOfDrinks(date.value)

const thisDrinkId = ref<number>(0)
const thisCounterId = ref<number>(0)
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
    <OrganismsPickerDatePicker />

    <div>
      <template
        v-for="(label, i) in labelsWithDrinks"
        :key="i"
      >
        <PagesIndexDrinkRow
          :label="label"
          :update-default-drink
          :increment="plusCheck"
          :decrement="minus"
        />
      </template>
    </div>

    <ShareWarningModal
      :title="$t(LOCALE_INDEX_WARNING_TITLE)"
      :content="$t(LOCALE_INDEX_WARNING_CONTENT, { drinkCountForDay })"
      :success="() => { modalIsActive = false; plus(thisDrinkId, thisCounterId) }"
      :cancel="() => modalIsActive = false"
      :class="modalIsActive ? 'is-active' : ''"
    />
  </div>
</template>
