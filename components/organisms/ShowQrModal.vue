<script
  setup
  lang="ts"
>
import { useOruga } from '@oruga-ui/oruga-next'
import QrModal from '~/components/molecules/QrModal.vue'

const oruga = useOruga()
function cardModal() {
  oruga.modal.open({
    component: QrModal,
    trapFocus: true,
    destroyOnHide: false,
  })
}
</script>

<template>
  <a
    class="navbar-item"
    exact-active-class="is-active"
    @click="cardModal()"
  >
    {{ $t('show_qr') }}
  </a>
</template>
