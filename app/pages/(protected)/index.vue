<spec lang="md">
# Top Page (Daily Counter)

当日の飲み物をラベル別にカウント・調整する画面。

## Data
- page store: `indexStore` → `date`, `labelsWithDrinks`, `drinkCountForDay`
- user settings: `userSetting.threshold_for_detecting_overdrinking`
- local computed: `thresholdCupCount`, `remainingCupCount`, `exceededCupCount`

## Interactions
- DatePicker で `date` が変わると `fetchNumberOfDrinks()` を再実行
- `DomainCounterMoleculesRow` の increment から `plusCheck(drinkId, counterId)`
  - 閾値超過なら警告モーダル表示
  - 未超過なら `plus(drinkId, counterId)`
- `DomainCounterMoleculesRow` の decrement から `minus(drinkId, counterId)`

## Features
- 日付選択（カレンダー）
- 現在杯数とアラートまでの残り/超過杯数を2枚のカードで表示する進捗サマリー
- ラベル/飲み物行のカウント増減
- 加算/減算後の Undo 通知（Undo ボタン、閉じるボタン、スワイプで dismiss）
- 過飲検知（閾値超過時の警告モーダル）

## Error Handling
- 例外処理・toast・logging は Page Store 側で責務分離（画面は直接処理しない）

## i18n
- SEO title / 警告文言 / 進捗サマリー文言は `utils/locales.ts` のキーを使用

## Notes
- #254 飲み物切り替え手順の改善の対象。UIフロー変更時に更新。
</spec>

<script setup lang="ts">
import {
  LOCALE_ROUTES_TOP,
  LOCALE_INDEX_WARNING_TITLE,
  LOCALE_INDEX_WARNING_CONTENT,
  LOCALE_INDEX_UNDO_ACTION,
  LOCALE_INDEX_UNDO_CLOSE,
  LOCALE_INDEX_UNDO_PLUS_MESSAGE,
  LOCALE_INDEX_UNDO_MINUS_MESSAGE,
  LOCALE_INDEX_PROGRESS_CURRENT_LABEL,
  LOCALE_INDEX_PROGRESS_REMAINING_LABEL,
  LOCALE_INDEX_PROGRESS_OVER_LABEL,
  LOCALE_SETTINGS_CUPS,
} from '~/utils/locales'
import { useUserStore } from '~/stores/user'
import { useAppStore } from '~/stores/app'
import { useIndexStore } from '~/stores/pages/index'

const { t } = useI18n()
useSeoMeta({
  title: t(LOCALE_ROUTES_TOP),
})

const { userSetting } = storeToRefs(useUserStore())
const { showPaceGuide } = storeToRefs(useSettingsStore())

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
const undoToken = ref<number>(0)
const UNDO_TIMEOUT_MS = 5000

const findDrinkById = (drinkId: number) => {
  return labelsWithDrinks.value.flatMap(label => label.drinks).find(drink => drink.id === drinkId)
}

const findDrinkContextById = (drinkId: number) => {
  for (const label of labelsWithDrinks.value) {
    const drink = label.drinks.find(item => item.id === drinkId)
    if (drink) {
      return {
        drink,
        labelName: label.name,
      }
    }
  }
  return undefined
}

const formatUndoTargetName = (labelName: string | undefined, drinkName: string) => {
  if (!labelName) {
    return drinkName
  }
  return `${labelName}：${drinkName}`
}

const scheduleUndo = (
  operation: 'plus' | 'minus',
  drinkId: number,
  drinkCounterId: number,
  drinkName: string,
) => {
  const token = Date.now()
  undoToken.value = token

  const undo = async () => {
    if (undoToken.value !== token) return
    undoToken.value = 0
    if (operation === 'plus') {
      await minus(drinkId, drinkCounterId)
    } else {
      await plus(drinkId, drinkCounterId)
    }
  }

  const message = operation === 'plus'
    ? t(LOCALE_INDEX_UNDO_PLUS_MESSAGE, { name: drinkName })
    : t(LOCALE_INDEX_UNDO_MINUS_MESSAGE, { name: drinkName })

  showUndoToast(
    message,
    t(LOCALE_INDEX_UNDO_ACTION),
    () => { void undo() },
    UNDO_TIMEOUT_MS,
    { closeAriaLabel: t(LOCALE_INDEX_UNDO_CLOSE) },
  )

  setTimeout(() => {
    if (undoToken.value === token) {
      undoToken.value = 0
    }
  }, UNDO_TIMEOUT_MS)
}

const plusWithUndo = async (drinkId: number, drinkCounterId: number) => {
  await plus(drinkId, drinkCounterId)
  const context = findDrinkContextById(drinkId)
  if (!context) return
  scheduleUndo(
    'plus',
    context.drink.id,
    context.drink.drinkCounterId,
    formatUndoTargetName(context.labelName, context.drink.name),
  )
}

const minusWithUndo = async (drinkId: number, drinkCounterId: number) => {
  const before = findDrinkContextById(drinkId)
  if (!before || before.drink.count === 0 || drinkCounterId === -1) {
    await minus(drinkId, drinkCounterId)
    return
  }

  const beforeCount = before.drink.count

  await minus(drinkId, drinkCounterId)
  const context = findDrinkContextById(drinkId)
  if (!context || context.drink.count === beforeCount) return
  scheduleUndo(
    'minus',
    context.drink.id,
    context.drink.drinkCounterId,
    formatUndoTargetName(context.labelName, context.drink.name),
  )
}

const decrementWithUndo = (drinkId: number, drinkCounterId: number) => {
  void minusWithUndo(drinkId, drinkCounterId)
}

const thresholdCupCount = computed(() => Math.max(1, userSetting.value.threshold_for_detecting_overdrinking ?? 1))
const currentCupCount = computed(() => drinkCountForDay.value)
const remainingCupCount = computed(() => Math.max(0, thresholdCupCount.value - currentCupCount.value))
const exceededCupCount = computed(() => Math.max(0, currentCupCount.value - thresholdCupCount.value))

const thresholdStatusText = computed(() => {
  if (exceededCupCount.value > 0) {
    return {
      label: t(LOCALE_INDEX_PROGRESS_OVER_LABEL),
      count: exceededCupCount.value,
      danger: true,
    }
  }
  return {
    label: t(LOCALE_INDEX_PROGRESS_REMAINING_LABEL),
    count: remainingCupCount.value,
    danger: false,
  }
})

// 杯数加算時の閾値チェック
const plusCheck = (drinkId: number, counterId: number) => {
  thisDrinkId.value = drinkId
  thisCounterId.value = counterId
  // 今飲んでる杯数が閾値を超えてたらアラートを出す
  if (userSetting.value.threshold_for_detecting_overdrinking <= drinkCountForDay.value) {
    modalIsActive.value = true
  } else {
    void plusWithUndo(drinkId, counterId)
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

    <section
      v-if="showPaceGuide"
      class="pace-summary-widget"
    >
      <div class="columns is-mobile is-gapless pace-kpi-columns">
        <div class="column pace-kpi-col">
          <div class="pace-kpi-box has-text-centered">
            <p class="pace-kpi-label">{{ t(LOCALE_INDEX_PROGRESS_CURRENT_LABEL) }}</p>
            <p class="pace-kpi-value">{{ currentCupCount }}<span class="pace-kpi-unit">{{ t(LOCALE_SETTINGS_CUPS) }}</span></p>
          </div>
        </div>
        <div class="column pace-kpi-col">
          <div class="pace-kpi-box has-text-centered">
            <p class="pace-kpi-label" :class="thresholdStatusText.danger ? 'has-text-danger' : ''">{{ thresholdStatusText.label }}</p>
            <p class="pace-kpi-value" :class="thresholdStatusText.danger ? 'has-text-danger' : ''">{{ thresholdStatusText.count }}<span class="pace-kpi-unit">{{ t(LOCALE_SETTINGS_CUPS) }}</span></p>
          </div>
        </div>
      </div>
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
          :decrement="decrementWithUndo"
        />
      </template>
    </div>

    <DomainActivityMoleculesLog :date="date" />

    <CommonModalMoleculesWarning
      :title="t(LOCALE_INDEX_WARNING_TITLE)"
      :content="t(LOCALE_INDEX_WARNING_CONTENT, { drinkCountForDay })"
      :success="() => { modalIsActive = false; void plusWithUndo(thisDrinkId, thisCounterId) }"
      :cancel="() => modalIsActive = false"
      :class="modalIsActive ? 'is-active' : ''"
    />
  </div>
</template>

<style scoped>
.pace-summary-widget {
  margin-bottom: 1rem;
}

.pace-kpi-columns {
  border: 1px solid var(--bulma-border, #dbdbdb);
  border-radius: 8px;
  background: var(--bulma-body-background-color, #fff);
  overflow: hidden;
}

.pace-kpi-col {
  display: flex;
  border-right: 1px solid var(--bulma-border, #dbdbdb);
}

.pace-kpi-col:last-child {
  border-right: none;
}

.pace-kpi-box {
  width: 100%;
  padding: 0.65rem 0.5rem;
}

.pace-kpi-label {
  margin: 0;
  font-size: clamp(0.66rem, 2.2vw, 0.82rem);
  color: var(--bulma-text, #4a4a4a);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pace-kpi-value {
  margin: 0.2rem 0 0;
  font-size: clamp(1.05rem, 4.2vw, 1.45rem);
  font-weight: 700;
  line-height: 1.2;
  white-space: nowrap;
}

.pace-kpi-unit {
  margin-left: 0.2rem;
  font-size: 0.72em;
  font-weight: 600;
}
</style>
