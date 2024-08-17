import * as bulmaToast from 'bulma-toast'

export const showToast = (message: string, type: bulmaToast.ToastType, duration: number = 2000) => {
  bulmaToast.toast({
    message: useProcessString.replaceLooseLineBreaks(message),
    duration,
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
  showToast(message, 'is-danger', 10000)
}
