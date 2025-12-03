import type { ActivityLogEntry } from './type'
import { getNextId, getMaxLogEntries, getLogRetentionDays } from './state'

export function useActivityLogActions () {
  const { activityLog } = useActivityLogState()

  /**
   * Add a new activity log entry
   */
  const addActivity = (type: 'plus' | 'minus', drinkName: string) => {
    const entry: ActivityLogEntry = {
      id: getNextId(),
      type,
      drinkName,
      timestamp: new Date(),
    }

    // Add to the beginning of the array (newest first)
    activityLog.value.unshift(entry)

    // Trim the log if it exceeds the maximum size
    if (activityLog.value.length > getMaxLogEntries()) {
      activityLog.value = activityLog.value.slice(0, getMaxLogEntries())
    }
  }

  /**
   * Clear all activity log entries
   */
  const clearActivityLog = () => {
    activityLog.value = []
  }

  /**
   * Remove expired log entries (older than retention period)
   */
  const cleanupExpiredEntries = () => {
    const retentionMs = getLogRetentionDays() * 24 * 60 * 60 * 1000
    const now = new Date()
    activityLog.value = activityLog.value.filter(
      entry => now.getTime() - entry.timestamp.getTime() < retentionMs
    )
  }

  return {
    addActivity,
    clearActivityLog,
    cleanupExpiredEntries,
  }
}
