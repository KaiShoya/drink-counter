<script setup lang="ts">
import { LOCALE_ROUTES_ABOUT, LOCALE_SOURCE, LOCALE_LICENSE, LOCALE_VERSION } from '~/utils/locales'

const { t } = useI18n()
useSeoMeta({
  title: t(LOCALE_ROUTES_ABOUT),
})
</script>

<template>
  <table class="table is-hoverable is-fullwidth is-striped">
    <tbody>
      <tr>
        <th colspan="2">
          <NuxtLink
            to="https://github.com/KaiShoya/drink-counter"
            class="display is-block"
          >
            {{ t(LOCALE_SOURCE) }}
          </NuxtLink>
        </th>
      </tr>
      <!-- <tr>
        <th colspan="2">
          <NuxtLink
            to="/about/terms_of_service"
            class="display is-block"
          >
            {{ t(LOCALE_TERMS_OF_SERVICE) }}
          </NuxtLink>
        </th>
      </tr> -->
      <tr>
        <th>{{ t(LOCALE_LICENSE) }}</th>
        <td>
          <NuxtLink
            to="https://github.com/KaiShoya/drink-counter/blob/main/LICENSE.md"
            class="display is-block"
          >
            MIT
          </NuxtLink>
        </td>
      </tr>

      <tr>
        <th>{{ t(LOCALE_VERSION) }}</th>
        <td>{{ $config.public.version }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
a {
  color: hsl(0, 0%, 21%);
}
</style>
