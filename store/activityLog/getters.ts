import type { ActivityLogEntry } from './type'
import { getLogRetentionDays } from './state'

export function useActivityLogGetters () {
  const { activityLog } = useActivityLogState()

  /**
   * Get the most recent activity log entry
   */
  const latestActivity = computed<ActivityLogEntry | null>(() => {
    if (activityLog.value.length === 0) {
      return null
    }
    return activityLog.value[0]
  })

  /**
   * Get all activity log entries sorted by timestamp (newest first)
   */
  const allActivities = computed<ActivityLogEntry[]>(() => {
    return [...activityLog.value]
  })

  /**
   * Get the time elapsed since the last activity in a human-readable format
   */
  const timeSinceLastActivity = computed<string | null>(() => {
    const latest = latestActivity.value
    if (!latest) {
      return null
    }

    const now = new Date()
    const diffMs = now.getTime() - latest.timestamp.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays > 0) {
      return `${diffDays}`
    }
    if (diffHours > 0) {
      return `${diffHours}`
    }
    if (diffMinutes > 0) {
      return `${diffMinutes}`
    }
    return '0'
  })

  /**
   * Get the unit for time since last activity
   */
  const timeSinceLastActivityUnit = computed<'days' | 'hours' | 'minutes' | null>(() => {
    const latest = latestActivity.value
    if (!latest) {
      return null
    }

    const now = new Date()
    const diffMs = now.getTime() - latest.timestamp.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays > 0) {
      return 'days'
    }
    if (diffHours > 0) {
      return 'hours'
    }
    return 'minutes'
  })

  /**
   * Check if there are any activities within the retention period
   */
  const hasRecentActivities = computed<boolean>(() => {
    if (activityLog.value.length === 0) {
      return false
    }

    const retentionMs = getLogRetentionDays() * 24 * 60 * 60 * 1000
    const now = new Date()
    return activityLog.value.some(
      entry => now.getTime() - entry.timestamp.getTime() < retentionMs
    )
  })

  return {
    latestActivity,
    allActivities,
    timeSinceLastActivity,
    timeSinceLastActivityUnit,
    hasRecentActivities,
  }
}
