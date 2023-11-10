export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:error', (err: ErrorConstructor) => {
    showDangerToast(err.toString())
  })
})
