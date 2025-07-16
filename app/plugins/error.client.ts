import { AuthError } from "@supabase/supabase-js";
import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin((nuxtApp) => {
  // nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
  //   console.log('errorHandler', error, instance, info)
  // }

  nuxtApp.hook("app:error", (err: unknown) => {
    handler(err);
  });

  window.addEventListener("unhandledrejection", (event) => {
    handler(event.reason);
  });
  nuxtApp.hook("vue:error", (error, _instance, _info) => {
    handler(error);
  });
});

const handler = (error: unknown) => {
  if (error instanceof CustomError) {
    showDangerToast(error.getMessage());
  } else if (error instanceof AuthError) {
    showDangerToast(error.code + " : " + error.message);
  } else if (error instanceof Error) {
    console.error(error);
    showDangerToast(error.name + " : " + error.message);
  } else {
    console.error(error);
    showDangerToast(LOCALE_ERROR_UNKNOWN + "\n" + error?.toString());
  }
};
