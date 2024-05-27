<script setup lang="ts">
const showModal = ref(false)
</script>

<template>
  <a
    class="navbar-item"
    exact-active-class="is-active"
    @click="showModal = true"
  >
    {{ $t(LOCALE_SHOW_QR) }}
  </a>
  <MoleculesQrModal
    v-show="showModal"
    :close="() => showModal = false"
  />
</template>
