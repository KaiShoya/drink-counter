<script setup lang="ts">
const localePath = useLocalePath()
const user = useSupabaseUser()

watch(
  user,
  () => {
    if (user.value) {
      // Redirect to protected page
      return navigateTo(localePath('/'))
    }
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div>Waiting for login...</div>
</template>
