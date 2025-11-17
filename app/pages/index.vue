<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { $i18n } = useNuxtApp()
useSeoMeta({
  title: $i18n.t(LOCALE_ROUTES_TOP),
})

const { userSetting } = storeToRefs(useUserStore())

const { showLoading, hideLoading } = useAppStore()
const indexStore = useIndexStore()
const { date, labelsWithDrinks, drinkCountForDay } = storeToRefs(indexStore)
const { setToday, fetchNumberOfDrinks, plus, minus, updateDefaultDrink } = indexStore

// Modal用フラグ
const modalIsActive = ref<boolean>(false)


try {
  showLoading()
  setToday()
  await fetchNumberOfDrinks()
} finally {
  hideLoading()
}

const thisDrinkId = ref<number>(0)
const thisCounterId = ref<number>(0)
// 杯数加算時の閾値チェック
const plusCheck = (drinkId: number, counterId: number) => {
  thisDrinkId.value = drinkId
  thisCounterId.value = counterId
  // 今飲んでる杯数が閾値を超えてたらアラートを出す
  if (userSetting.value.threshold_for_detecting_overdrinking <= drinkCountForDay.value) {
    modalIsActive.value = true
  } else {
    plus(drinkId, counterId)
  }
}

watch(date, async () => {
  try {
    showLoading()
    await fetchNumberOfDrinks()
  } finally {
    hideLoading()
  }
})
</script>

<template>
  <div>
    <DomainPickerMoleculesDatePicker />

    <div>
      <template
        v-for="(label, i) in labelsWithDrinks"
        :key="i"
      >
        <DomainCounterMoleculesRow
          :label="label"
          :update-default-drink
          :increment="plusCheck"
          :decrement="minus"
        />
      </template>
    </div>

    <CommonModalMoleculesWarning
      :title="$t(LOCALE_INDEX_WARNING_TITLE)"
      :content="$t(LOCALE_INDEX_WARNING_CONTENT, { drinkCountForDay })"
      :success="() => { modalIsActive = false; plus(thisDrinkId, thisCounterId) }"
      :cancel="() => modalIsActive = false"
      :class="modalIsActive ? 'is-active' : ''"
    />
  </div>
</template>
