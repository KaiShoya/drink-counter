// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'

vi.mock('bulma-toast', () => ({ toast: vi.fn() }))

import { showSuccessToast, showWarningToast, showDangerToast } from './toast'
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
})
