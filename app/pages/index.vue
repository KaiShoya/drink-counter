<spec lang="md">
# Top Page (Daily Counter)

当日の飲み物をラベル別にカウント・調整する画面。

## Data
- page store: `indexStore` → `date`, `labelsWithDrinks`, `drinkCountForDay`
- user settings: `userSetting.threshold_for_detecting_overdrinking`

## Interactions
- DatePicker で `date` が変わると `fetchNumberOfDrinks()` を再実行
- `DomainCounterMoleculesRow` の increment から `plusCheck(drinkId, counterId)`
  - 閾値超過なら警告モーダル表示
  - 未超過なら `plus(drinkId, counterId)`
- `DomainCounterMoleculesRow` の decrement から `minus(drinkId, counterId)`

## Features
- 日付選択（カレンダー）
- ラベル/飲み物行のカウント増減
- 過飲検知（閾値超過時の警告モーダル）

## Error Handling
- 例外処理・toast・logging は Page Store 側で責務分離（画面は直接処理しない）

## i18n
- SEO title / 警告文言は `utils/locales.ts` のキーを使用

## Notes
- #254 飲み物切り替え手順の改善の対象。UIフロー変更時に更新。
</spec>

<script setup lang="ts">
import { LOCALE_ROUTES_TOP, LOCALE_INDEX_WARNING_TITLE, LOCALE_INDEX_WARNING_CONTENT } from '~/utils/locales'

definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()
useSeoMeta({
  title: t(LOCALE_ROUTES_TOP),
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

    <DomainActivityMoleculesLog />

    <CommonModalMoleculesWarning
      :title="t(LOCALE_INDEX_WARNING_TITLE)"
      :content="t(LOCALE_INDEX_WARNING_CONTENT, { drinkCountForDay })"
      :success="() => { modalIsActive = false; plus(thisDrinkId, thisCounterId) }"
      :cancel="() => modalIsActive = false"
      :class="modalIsActive ? 'is-active' : ''"
    />
  </div>
</template>
