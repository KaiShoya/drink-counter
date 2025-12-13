import type { ActivityLogEntry } from './type'

/** Maximum number of log entries to keep */
const MAX_LOG_ENTRIES = 100

/** Number of days to keep log entries */
const LOG_RETENTION_DAYS = 3

const activityLog = ref<ActivityLogEntry[]>([])

let nextId = 1

export function useActivityLogState () {
  return {
    activityLog,
  }
}

export function getNextId () {
  return nextId++
}

export function getMaxLogEntries () {
  return MAX_LOG_ENTRIES
}

export function getLogRetentionDays () {
  return LOG_RETENTION_DAYS
}
