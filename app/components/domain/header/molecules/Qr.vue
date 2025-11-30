<script setup lang="ts">
import { LOCALE_SHOW_QR } from '~/utils/locales'

const { t } = useI18n()
const showModal = ref(false)
</script>

<template>
  <a
    class="navbar-item"
    exact-active-class="is-active"
    @click="showModal = true"
  >
    {{ t(LOCALE_SHOW_QR) }}
  </a>
  <DomainHeaderAtomsQr
    v-show="showModal"
    :close="() => showModal = false"
  />
</template>
