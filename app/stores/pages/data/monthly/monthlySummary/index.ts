import { useMonthlySummaryState } from './state'
import { useMonthlySummaryGetters } from './getters'
import { useMonthlySummaryActions } from './actions'

/**
 * 月別集計ストア（雛形）
 * - 仕様の I/O 契約に沿い、まずはダミーデータを返却
 * - 後続で Supabase からの取得＆集計ロジックを実装
 */
export const useMonthlySummaryStore = defineStore('pages/index/monthlySummary', () => {
  return {
    ...useMonthlySummaryState(),
    ...useMonthlySummaryGetters(),
    ...useMonthlySummaryActions(),
  }
})
