<script setup lang="ts">
defineProps<{
  isLogin: boolean,
}>()

const localePath = useLocalePath()
const { signOut } = useSupabaseStore()

const clickFn = async () => {
  await signOut()
  navigateTo(localePath('/'), { external: true })
}

</script>
<template>
  <a
    v-if="isLogin"
    class="navbar-item"
    exact-active-class="is-active"
    @click="clickFn()"
  >
    {{ $t(LOCALE_AUTH_LOGOUT) }}
  </a>
</template>
