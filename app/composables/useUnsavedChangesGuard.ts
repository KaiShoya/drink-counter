type GuardSource = Ref<boolean> | ComputedRef<boolean> | (() => boolean)

type UseUnsavedChangesGuardOptions = {
  isDirty: GuardSource
  canLeave?: GuardSource
  canSkip?: GuardSource
  onDiscard?: () => void | Promise<void>
}

const readGuard = (source?: GuardSource): boolean => {
  if (!source) return false
  if (typeof source === 'function') return source()
  return source.value
}

export const useUnsavedChangesGuard = (options: UseUnsavedChangesGuardOptions) => {
  const showUnsavedModal = ref<boolean>(false)
  const pendingLeaveResolver = ref<((confirmed: boolean) => void) | null>(null)

  const shouldBlockLeave = () => {
    const skip = readGuard(options.canSkip) || readGuard(options.canLeave)
    return !skip && readGuard(options.isDirty)
  }

  const requestLeaveConfirmation = () => {
    showUnsavedModal.value = true
    return new Promise<boolean>((resolve) => {
      pendingLeaveResolver.value = resolve
    })
  }

  const resolveLeaveConfirmation = (confirmed: boolean) => {
    showUnsavedModal.value = false
    pendingLeaveResolver.value?.(confirmed)
    pendingLeaveResolver.value = null
  }

  const discardAndLeave = async () => {
    await options.onDiscard?.()
    resolveLeaveConfirmation(true)
  }

  const cancelLeave = () => {
    resolveLeaveConfirmation(false)
  }

  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (shouldBlockLeave()) {
      e.preventDefault()
    }
  }

  onMounted(() => window.addEventListener('beforeunload', handleBeforeUnload))
  onUnmounted(() => window.removeEventListener('beforeunload', handleBeforeUnload))

  onBeforeRouteLeave(async () => {
    if (!shouldBlockLeave()) {
      return true
    }
    return await requestLeaveConfirmation()
  })

  return {
    showUnsavedModal,
    requestLeaveConfirmation,
    resolveLeaveConfirmation,
    discardAndLeave,
    cancelLeave,
    handleBeforeUnload,
  }
}
