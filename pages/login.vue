<script setup lang="ts">
const { signInWithGoogle } = useSupabaseStore()

const localePath = useLocalePath()
const user = useSupabaseUser()
watch(
  user,
  () => {
    if (user.value) {
      return navigateTo(localePath('/'))
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
