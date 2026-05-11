const thresholdForDetectingOverdrinking = ref<number>(2)
const timezone = ref<string>('Asia/Tokyo')
const switchingTiming = ref<number>(9)
const showPaceGuide = ref<boolean>(true)

const PACE_GUIDE_STORAGE_KEY = 'settings:show-pace-guide:v1'
let paceGuideHydrated = false

export function hydratePaceGuideVisibility () {
  if (paceGuideHydrated || !process.client) {
    return
  }

  const stored = localStorage.getItem(PACE_GUIDE_STORAGE_KEY)
  if (stored === null) {
    paceGuideHydrated = true
    return
  }

  showPaceGuide.value = stored === 'true'
  paceGuideHydrated = true
}

export function persistPaceGuideVisibility () {
  if (!process.client) {
    return
  }

  localStorage.setItem(PACE_GUIDE_STORAGE_KEY, String(showPaceGuide.value))
}

export function useSettingsState () {
  hydratePaceGuideVisibility()

  return {
    thresholdForDetectingOverdrinking,
    timezone,
    switchingTiming,
    showPaceGuide,
  }
}
