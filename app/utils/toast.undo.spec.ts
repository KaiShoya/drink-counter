// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { toastMock } = vi.hoisted(() => ({
  toastMock: vi.fn((options: { message: unknown, extraClasses?: string }) => {
    const notification = document.createElement('div')
    notification.className = ['notification', options.extraClasses].filter(Boolean).join(' ')

    if (options.message instanceof HTMLElement) {
      notification.append(options.message)
    } else {
      notification.textContent = String(options.message)
    }

    document.body.append(notification)
  }),
}))

vi.mock('bulma-toast', () => ({ toast: toastMock }))

import { showUndoToast } from './toast'

describe('showUndoToast close button', () => {
  beforeEach(() => {
    toastMock.mockClear()
    document.body.innerHTML = ''
  })

  it('dismisses toast when close button is clicked', () => {
    showUndoToast('message', 'undo', vi.fn(), 5000, { closeAriaLabel: 'close' })

    const latestCall = toastMock.mock.calls.at(-1)?.[0]
    expect(latestCall).toEqual(expect.objectContaining({
      extraClasses: 'toast',
      type: 'is-primary',
    }))

    const closeButton = document.querySelector<HTMLButtonElement>('button.delete')
    expect(closeButton).not.toBeNull()

    closeButton?.click()

    expect(document.querySelector('.notification.toast')).toBeNull()
  })
})
