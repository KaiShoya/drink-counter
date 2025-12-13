<spec lang="md">
飲み物カウンターの操作履歴を表示するコンポーネント。
最終更新時刻と操作ログを折りたたみ可能なリストで表示する。

## Features
- 折りたたみ可能な履歴リスト（details/summary要素を使用）
- 最終更新からの経過時間を表示（分/時間/日）
- 各操作のタイムスタンプとアイコン（+/-）を表示
- 3日間のログ保持、最大100件まで表示

## State
- useActivityLogStore から以下を取得:
  - latestActivity: 最新の操作ログ
  - allActivities: 全ての操作ログ
  - timeSinceLastActivity: 最終更新からの経過時間
  - timeSinceLastActivityUnit: 経過時間の単位（minutes/hours/days）
  - hasRecentActivities: 保持期間内のログがあるかどうか
</spec>

<script setup lang="ts">
import {
  LOCALE_ACTIVITY_LOG_TITLE,
  LOCALE_ACTIVITY_LOG_LAST_UPDATE,
  LOCALE_ACTIVITY_LOG_MINUTES_AGO,
  LOCALE_ACTIVITY_LOG_HOURS_AGO,
  LOCALE_ACTIVITY_LOG_DAYS_AGO,
  LOCALE_ACTIVITY_LOG_PLUS,
  LOCALE_ACTIVITY_LOG_MINUS,
  LOCALE_ACTIVITY_LOG_NO_ACTIVITY,
} from '~/utils/locales'

const { t } = useI18n()

const activityLogStore = useActivityLogStore()
const { latestActivity, allActivities, timeSinceLastActivity, timeSinceLastActivityUnit, hasRecentActivities } = storeToRefs(activityLogStore)

const formatTimeAgo = (time: string | null, unit: 'days' | 'hours' | 'minutes' | null) => {
  if (time === null || unit === null) {
    return ''
  }

  switch (unit) {
    case 'days':
      return t(LOCALE_ACTIVITY_LOG_DAYS_AGO, { time })
    case 'hours':
      return t(LOCALE_ACTIVITY_LOG_HOURS_AGO, { time })
    case 'minutes':
      return t(LOCALE_ACTIVITY_LOG_MINUTES_AGO, { time })
    default:
      return ''
  }
}

const formatActivityType = (type: 'plus' | 'minus', drinkName: string) => {
  if (type === 'plus') {
    return t(LOCALE_ACTIVITY_LOG_PLUS, { drinkName })
  }
  return t(LOCALE_ACTIVITY_LOG_MINUS, { drinkName })
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <details class="activity-log-details mt-4">
    <summary class="activity-log-summary">
      <span class="is-size-6 has-text-weight-semibold">{{ t(LOCALE_ACTIVITY_LOG_TITLE) }}</span>
      <span
        v-if="latestActivity"
        class="is-size-7 ml-2 has-text-grey"
      >
        {{ t(LOCALE_ACTIVITY_LOG_LAST_UPDATE) }}: {{ formatTimeAgo(timeSinceLastActivity, timeSinceLastActivityUnit) }}
      </span>
    </summary>
    <div class="activity-log-content mt-2">
      <template v-if="hasRecentActivities">
        <div
          v-for="activity in allActivities"
          :key="activity.id"
          class="activity-log-item is-size-7 py-1"
        >
          <span class="activity-time has-text-grey">{{ formatTime(activity.timestamp) }}</span>
          <span
            class="activity-icon ml-2"
            :class="activity.type === 'plus' ? 'has-text-success' : 'has-text-danger'"
          >
            <Icon :name="activity.type === 'plus' ? 'mdi:plus-circle' : 'mdi:minus-circle'" />
          </span>
          <span class="ml-1">{{ formatActivityType(activity.type, activity.drinkName) }}</span>
        </div>
      </template>
      <template v-else>
        <p class="is-size-7 has-text-grey">{{ t(LOCALE_ACTIVITY_LOG_NO_ACTIVITY) }}</p>
      </template>
    </div>
  </details>
</template>

<style scoped>
.activity-log-details {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 8px 12px;
}

.activity-log-summary {
  cursor: pointer;
  list-style: none;
}

.activity-log-summary::-webkit-details-marker {
  display: none;
}

.activity-log-content {
  max-height: 200px;
  overflow-y: auto;
}

.activity-log-item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
}

.activity-log-item:last-child {
  border-bottom: none;
}

.activity-time {
  min-width: 50px;
}
</style>
