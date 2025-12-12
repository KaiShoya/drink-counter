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
    <!-- <spec>
      title: Top Page (Daily Counter)
      purpose: ユーザーが当日の飲み物をラベル別にカウント・調整できる画面。
      responsibilities:
        - 日付選択（カレンダー）と当日の合計カウント表示
        - ラベル行ごとの増減・デフォルト飲み物設定
        - 過飲検知閾値超過時のモーダル警告表示
      data:
        - from page store: `indexStore` → `date`, `labelsWithDrinks`, `drinkCountForDay`
        - user settings: `userSetting.threshold_for_detecting_overdrinking`
      interactions:
        - increment: `plusCheck(drinkId, counterId)`（閾値チェック→必要時モーダル）
        - decrement: `minus(drinkId, counterId)`
        - set default drink: `updateDefaultDrink`
      error-handling:
        - Page Store が toast と logging を担当（本画面では直接処理しない）
      i18n:
        - タイトルと警告文言は `utils/locales.ts` のキーを使用
      notes:
        - #254 の「飲み物切り替え手順の改善」対象。UIフロー変更時はここに反映。
    </spec> -->
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
      :title="t(LOCALE_INDEX_WARNING_TITLE)"
      :content="t(LOCALE_INDEX_WARNING_CONTENT, { drinkCountForDay })"
      :success="() => { modalIsActive = false; plus(thisDrinkId, thisCounterId) }"
      :cancel="() => modalIsActive = false"
      :class="modalIsActive ? 'is-active' : ''"
    />
  </div>
</template>
