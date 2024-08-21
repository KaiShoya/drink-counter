<script setup lang="ts">
const route = useRoute()
const { signInWithGoogle } = useSupabaseStore()

const localePath = useLocalePath()
const user = useSupabaseUser()
watch(
  user,
  () => {
    if (user.value) {
      const fullpath = route.query.fullpath?.toString() ?? localePath('/')
      return navigateTo(fullpath)
    }
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div>
    <button
      class="button"
      @click="signInWithGoogle()"
    >
      Googleアカウントを利用する
    </button>
  </div>
</template>
