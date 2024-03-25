<script
  setup
  lang="ts"
>
import { storeToRefs } from 'pinia'
import { useLayoutStore } from '~/store/layout'

const { showQrModal } = storeToRefs(useLayoutStore())
</script>

<template>
  <o-modal v-model:active="showQrModal">
    <p style="text-align: center">
      <img src="/qrcode.svg">
    </p>
  </o-modal>
</template>
