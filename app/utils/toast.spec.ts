// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'

vi.mock('bulma-toast', () => ({ toast: vi.fn() }))

import { showSuccessToast, showWarningToast, showDangerToast, showUndoToast } from './toast'
import * as bulmaToast from 'bulma-toast'

describe('toast utils', () => {
  it('showSuccessToast calls bulma-toast', () => {
    showSuccessToast('ok')
    expect((bulmaToast as any).toast).toHaveBeenCalled()
  })
  it('showWarningToast calls bulma-toast', () => {
    showWarningToast('warn')
    expect((bulmaToast as any).toast).toHaveBeenCalled()
  })
  it('showDangerToast calls bulma-toast', () => {
    showDangerToast('danger')
    expect((bulmaToast as any).toast).toHaveBeenCalled()
  })
  it('showUndoToast calls bulma-toast', () => {
    showUndoToast('message', 'undo', vi.fn(), 5000, { closeAriaLabel: 'close' })
    const latestCall = (bulmaToast as any).toast.mock.calls.at(-1)?.[0]
    expect(latestCall).toEqual(expect.objectContaining({
      type: 'is-warning',
      duration: 2000,
    }))
  })
})
