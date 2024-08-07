import { AuthError } from '@supabase/supabase-js'

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

const handler = (error: unknown) => {
  if (error instanceof CustomError) {
    showDangerToast(error.getMessage())
  } else if (error instanceof AuthError) {
    showDangerToast(error.code + ' : ' + error.message)
  } else if (error instanceof Error) {
    // eslint-disable-next-line no-console
    console.log(error)
    showDangerToast(error.name + ' : ' + error.message)
  } else {
    // eslint-disable-next-line no-console
    console.log(error)
    showDangerToast(LOCALE_ERROR_UNKNOWN + '\n' + error?.toString())
  }
}
