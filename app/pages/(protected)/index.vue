<spec lang="md">
# Top Page (Daily Counter)

当日の飲み物をラベル別にカウント・調整する画面。

## Data
- page store: `indexStore` → `date`, `labelsWithDrinks`, `drinkCountForDay`
- user settings: `userSetting.threshold_for_detecting_overdrinking`
- local computed: `quickRecordCandidates`（当日上位3件のクイック候補）

## Interactions
- DatePicker で `date` が変わると `fetchNumberOfDrinks()` を再実行
- クイック記録ボタン押下で `plusCheck(drinkId, counterId)` を呼ぶ
- `DomainCounterMoleculesRow` の increment から `plusCheck(drinkId, counterId)`
  - 閾値超過なら警告モーダル表示
  - 未超過なら `plus(drinkId, counterId)`
- `DomainCounterMoleculesRow` の decrement から `minus(drinkId, counterId)`

## Features
- 日付選択（カレンダー）
- 上位3件クイック記録ウィジェット（候補0件時はフォールバック文言表示）
- ラベル/飲み物行のカウント増減
- 過飲検知（閾値超過時の警告モーダル）

## Error Handling
- 例外処理・toast・logging は Page Store 側で責務分離（画面は直接処理しない）

## i18n
- SEO title / 警告文言 / クイック記録文言は `utils/locales.ts` のキーを使用

## Notes
- #254 飲み物切り替え手順の改善の対象。UIフロー変更時に更新。
</spec>

<script setup lang="ts">
import {
  LOCALE_ROUTES_TOP,
  LOCALE_INDEX_WARNING_TITLE,
  LOCALE_INDEX_WARNING_CONTENT,
  LOCALE_INDEX_QUICK_RECORD_TITLE,
  LOCALE_INDEX_QUICK_RECORD_EMPTY,
} from '~/utils/locales'
import { useUserStore } from '~/stores/user'
import { useAppStore } from '~/stores/app'
import { useIndexStore } from '~/stores/pages/index'

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

const quickRecordCandidates = computed(() => {
  const flattened = labelsWithDrinks.value.flatMap(label => label.drinks)
  if (flattened.length === 0) return []

  const withCount = flattened.filter(drink => (drink.count ?? 0) > 0)
  if (withCount.length > 0) {
    return [...withCount]
      .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
      .slice(0, 3)
  }

  return flattened.slice(0, 3)
})

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

    <section class="box quick-record-widget">
      <h3 class="title is-6 mb-3">
        {{ t(LOCALE_INDEX_QUICK_RECORD_TITLE) }}
      </h3>
      <div
        v-if="quickRecordCandidates.length > 0"
        class="buttons"
      >
        <button
          v-for="drink in quickRecordCandidates"
          :key="drink.id"
          type="button"
          class="button is-light quick-record-button"
          @click="plusCheck(drink.id, drink.drinkCounterId)"
        >
          <span class="tag mr-2 quick-record-color" :style="{ backgroundColor: drink.color }" />
          <span>{{ drink.name }}</span>
        </button>
      </div>
      <p
        v-else
        class="has-text-grey"
      >
        {{ t(LOCALE_INDEX_QUICK_RECORD_EMPTY) }}
      </p>
    </section>

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

    <DomainActivityMoleculesLog :date="date" />

    <CommonModalMoleculesWarning
      :title="t(LOCALE_INDEX_WARNING_TITLE)"
      :content="t(LOCALE_INDEX_WARNING_CONTENT, { drinkCountForDay })"
      :success="() => { modalIsActive = false; plus(thisDrinkId, thisCounterId) }"
      :cancel="() => modalIsActive = false"
      :class="modalIsActive ? 'is-active' : ''"
    />
  </div>
</template>

<style scoped>
.quick-record-widget {
  margin-bottom: 1rem;
}

.quick-record-button {
  min-width: 9rem;
  justify-content: flex-start;
}

.quick-record-color {
  width: 0.9rem;
  height: 0.9rem;
  padding: 0;
}
</style>
