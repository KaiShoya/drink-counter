<spec lang="md">
# Total Data Page
全期間データの可視化ページ。
Loading / Empty / Error の状態表示を共通UIで統一する。

## Data
- useTotalStore: `drinkCounters`, `fetchDrinkCountersAll`
- local state: `isFetching`, `isFetched`, `fetchError`

## Interactions
- 初回表示時に `refreshPageData()` を実行
- エラー時の「再試行」で `refreshPageData()` を再実行
- Empty 時の CTA で `/` へ遷移

## Features
- 読み込み中は明示的に loading state を表示
- 0件時は next action を提示
- 取得失敗時は統一エラー表示と再試行導線を提示

## Error Handling
- 例外は `fetchError` に保持し、`logger.error` で記録

## i18n
- 文言は `data.state.*` キーを使用
</spec>

<script setup lang="ts">
const { t } = useI18n()
useSeoMeta({
  title: t(LOCALE_ROUTES_TOTAL),
})

const totalStore = useTotalStore()
const { fetchDrinkCountersAll } = totalStore
const { drinkCounters } = storeToRefs(totalStore)

const isFetching = ref<boolean>(false)
const isFetched = ref<boolean>(false)
const fetchError = ref<string | null>(null)

const pageMode = computed(() => {
  return resolveDataPageMode({
    isFetching: isFetching.value,
    isFetched: isFetched.value,
    hasError: Boolean(fetchError.value),
    totalCount: drinkCounters.value.length,
  })
})

const refreshPageData = async () => {
  isFetching.value = true
  fetchError.value = null
  try {
    await fetchDrinkCountersAll()
  } catch (error) {
    fetchError.value = error instanceof Error ? error.message : String(error)
    logger.error('Failed to fetch total data page', { module: 'pages/data/total.vue' }, error)
  } finally {
    isFetching.value = false
    isFetched.value = true
  }
}

const moveToRecordingPage = async () => {
  await navigateTo('/')
}

refreshPageData()
</script>

<template>
  <div class="container">
    <DomainChartMoleculesDataState
      v-if="pageMode === 'loading'"
      mode="loading"
      :show-action="false"
    />
    <DomainChartMoleculesDataState
      v-else-if="pageMode === 'error'"
      mode="error"
      @action="refreshPageData"
    />
    <DomainChartMoleculesDataState
      v-else-if="pageMode === 'empty'"
      mode="empty"
      @action="moveToRecordingPage"
    />

    <template v-else>
      <DomainChartAtomsPieChart />

      <DomainChartMoleculesAggregationByDrinksTable />

      <DomainChartMoleculesAggregationByDowTable />
    </template>
  </div>
</template>
