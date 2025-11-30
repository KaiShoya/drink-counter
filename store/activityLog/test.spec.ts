// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

describe('ActivityLog Store', () => {
  let store: ReturnType<typeof import('./index').useActivityLogStore>

  beforeEach(async () => {
    // creates a fresh pinia and makes it active
    setActivePinia(createPinia())

    // Reset the module to get fresh state
    vi.resetModules()

    const { useActivityLogStore } = await import('./index')
    store = useActivityLogStore()
    // Clear any existing entries
    store.clearActivityLog()
  })

  describe('addActivity', () => {
    it('adds a plus activity to the log', () => {
      store.addActivity('plus', 'ビール')

      expect(store.activityLog.length).toBe(1)
      expect(store.activityLog[0].type).toBe('plus')
      expect(store.activityLog[0].drinkName).toBe('ビール')
      expect(store.activityLog[0].timestamp).toBeInstanceOf(Date)
    })

    it('adds a minus activity to the log', () => {
      store.addActivity('minus', 'ハイボール')

      expect(store.activityLog.length).toBe(1)
      expect(store.activityLog[0].type).toBe('minus')
      expect(store.activityLog[0].drinkName).toBe('ハイボール')
    })

    it('adds new activities at the beginning (newest first)', () => {
      store.addActivity('plus', 'ビール')
      store.addActivity('plus', 'ハイボール')

      expect(store.activityLog.length).toBe(2)
      expect(store.activityLog[0].drinkName).toBe('ハイボール')
      expect(store.activityLog[1].drinkName).toBe('ビール')
    })
  })

  describe('latestActivity', () => {
    it('returns null when there are no activities', () => {
      expect(store.latestActivity).toBeNull()
    })

    it('returns the most recent activity', () => {
      store.addActivity('plus', 'ビール')
      store.addActivity('minus', 'ハイボール')

      expect(store.latestActivity?.drinkName).toBe('ハイボール')
      expect(store.latestActivity?.type).toBe('minus')
    })
  })

  describe('allActivities', () => {
    it('returns an empty array when there are no activities', () => {
      expect(store.allActivities).toEqual([])
    })

    it('returns all activities sorted by timestamp (newest first)', () => {
      store.addActivity('plus', 'ビール')
      store.addActivity('minus', 'ハイボール')
      store.addActivity('plus', 'ワイン')

      expect(store.allActivities.length).toBe(3)
      expect(store.allActivities[0].drinkName).toBe('ワイン')
      expect(store.allActivities[1].drinkName).toBe('ハイボール')
      expect(store.allActivities[2].drinkName).toBe('ビール')
    })
  })

  describe('timeSinceLastActivity', () => {
    it('returns null when there are no activities', () => {
      expect(store.timeSinceLastActivity).toBeNull()
    })

    it('returns the time since the last activity', () => {
      store.addActivity('plus', 'ビール')
      // The activity was just added, so the time should be very short
      expect(store.timeSinceLastActivity).toBe('0')
      expect(store.timeSinceLastActivityUnit).toBe('minutes')
    })
  })

  describe('clearActivityLog', () => {
    it('clears all activities', () => {
      store.addActivity('plus', 'ビール')
      store.addActivity('minus', 'ハイボール')

      store.clearActivityLog()

      expect(store.activityLog.length).toBe(0)
    })
  })

  describe('hasRecentActivities', () => {
    it('returns false when there are no activities', () => {
      expect(store.hasRecentActivities).toBe(false)
    })

    it('returns true when there are recent activities', () => {
      store.addActivity('plus', 'ビール')
      expect(store.hasRecentActivities).toBe(true)
    })
  })
})
