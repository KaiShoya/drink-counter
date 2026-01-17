import type { ActivityLogEntry } from './type'
import {
  getNextId,
  getMaxLogEntries,
  getLogRetentionDays,
  hydrateActivityLogFromStorage,
  persistActivityLog,
} from './state'

export function useActivityLogActions () {
  const { activityLog } = useActivityLogState()

  /**
   * Hydrate from localStorage and cleanup once on entry.
   */
  const initializeActivityLog = () => {
    hydrateActivityLogFromStorage()
    cleanupExpiredEntries()
    persistActivityLog()
  }

  /**
   * Add a new activity log entry
   */
  const addActivity = (type: 'plus' | 'minus', drinkName: string, drinkLabelName: string | null = null, date: string = '') => {
    cleanupExpiredEntries()

    const entry: ActivityLogEntry = {
      id: getNextId(),
      type,
      drinkName,
      drinkLabelName,
      date,
      timestamp: new Date(),
    }

    // Add to the beginning of the array (newest first)
    activityLog.value.unshift(entry)

    // Trim the log if it exceeds the maximum size
    if (activityLog.value.length > getMaxLogEntries()) {
      activityLog.value = activityLog.value.slice(0, getMaxLogEntries())
    }

    persistActivityLog()
  }

  /**
   * Clear all activity log entries
   */
  const clearActivityLog = () => {
    activityLog.value = []
    persistActivityLog()
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

    persistActivityLog()
  }

  return {
    initializeActivityLog,
    addActivity,
    clearActivityLog,
    cleanupExpiredEntries,
  }
}
