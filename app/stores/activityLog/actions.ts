import type { ActivityLogEntry } from './type'
import {
  getNextId,
  getMaxLogEntries,
  getLogRetentionDays,
  hydrateActivityLogFromStorage,
  persistActivityLog,
  useActivityLogState,
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
   * @param type - Operation type: 'plus' or 'minus'
   * @param drinkName - Name of the drink
   * @param drinkLabelName - Label name associated with the drink (optional)
   * @param date - Date of the activity in YYYY-MM-DD format (required)
   */
  const addActivity = (type: 'plus' | 'minus', drinkName: string, drinkLabelName: string | null, date: string) => {
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

    // Persist once after all mutations
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
   * Note: Does not persist automatically - caller should persist after cleanup
   */
  const cleanupExpiredEntries = () => {
    const retentionMs = getLogRetentionDays() * 24 * 60 * 60 * 1000
    const now = new Date()
    activityLog.value = activityLog.value.filter(
      entry => now.getTime() - entry.timestamp.getTime() < retentionMs
    )
  }

  return {
    initializeActivityLog,
    addActivity,
    clearActivityLog,
    cleanupExpiredEntries,
  }
}
