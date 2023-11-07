import * as bulmaToast from 'bulma-toast'

export const showToast = (message: string, type: bulmaToast.ToastType) => {
  bulmaToast.toast({
    message,
    duration: 10000,
    type,
    dismissible: true,
    animate: { in: 'fadeIn', out: 'fadeOut' },
  })
}

export const showSuccessToast = (message: string) => {
  showToast(message, 'is-success')
}

export const showWarningToast = (message: string) => {
  showToast(message, 'is-warning')
}

export const showDangerToast = (message: string) => {
  showToast(message, 'is-danger')
}
