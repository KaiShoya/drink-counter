import type { ActivityLogEntry } from './type'

/** Maximum number of log entries to keep */
const MAX_LOG_ENTRIES = 100

/** Number of days to keep log entries */
const LOG_RETENTION_DAYS = 7

const STORAGE_KEY = 'activityLog:v1'

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

export function hydrateActivityLogFromStorage () {
  if (!process.client) {
    return
  }

  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    return
  }

  try {
    const parsed: Array<Omit<ActivityLogEntry, 'timestamp'> & { timestamp: string }> = JSON.parse(stored)
    const hydrated = parsed
      .map(entry => ({ ...entry, timestamp: new Date(entry.timestamp) }))
      .filter(entry => !Number.isNaN(entry.timestamp.getTime()))

    activityLog.value = hydrated

    const maxId = hydrated.reduce((acc, entry) => Math.max(acc, entry.id), 0)
    nextId = maxId + 1
  } catch {
    localStorage.removeItem(STORAGE_KEY)
  }
}

export function persistActivityLog () {
  if (!process.client) {
    return
  }

  const serialized = activityLog.value.map(entry => ({
    ...entry,
    timestamp: entry.timestamp.toISOString(),
  }))

  localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized))
}
