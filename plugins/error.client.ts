import * as bulmaToast from 'bulma-toast'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:error', (err: ErrorConstructor) => {
    bulmaToast.toast({
      message: err.toString(),
      duration: 30000,
      type: 'is-danger',
      dismissible: true,
      animate: { in: 'fadeIn', out: 'fadeOut' },
    })
  })
})
