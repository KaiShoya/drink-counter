export default defineNuxtPlugin((nuxtApp) => {
  // nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
  //   console.log('errorHandler', error, instance, info)
  // }

  nuxtApp.hook('app:error', (err: ErrorConstructor) => {
    showDangerToast(err.toString())
  })

  window.addEventListener('unhandledrejection', (event: any) => {
    handler(event.reason)
  })
  nuxtApp.hook('vue:error', (error, _instance, _info) => {
    handler(error)
  })
})

export const handler = (error: unknown) => {
  const { $i18n } = useNuxtApp()
  if (error instanceof Response500Error) {
    showDangerToast($i18n.t(error.getMessage()))
  } else if (error instanceof GetRecordError) {
    showDangerToast($i18n.t(error.getMessage()))
  } else if (error instanceof GetUserInfoError) {
    showDangerToast($i18n.t(error.getMessage()))
  } else if (error instanceof SupabaseResponseError) {
    showDangerToast($i18n.t(error.getMessage()))
  } else if (error instanceof CustomError) {
    showDangerToast($i18n.t(error.getMessage()))
  } else if (error instanceof Error) {
    showDangerToast($i18n.t(error.message))
  }
}
