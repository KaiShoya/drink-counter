<script
  setup
  lang="ts"
>
import { storeToRefs } from 'pinia'
import { useLayoutStore } from '~/store/layout'

const { showQrModal } = storeToRefs(useLayoutStore())
</script>

<template>
  <a
    class="navbar-item"
    exact-active-class="is-active"
    @click="showQrModal = true"
  >
    {{ $t('show_qr') }}
  </a>

  <MoleculesQrModal />
</template>
