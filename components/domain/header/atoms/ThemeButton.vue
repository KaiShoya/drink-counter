<script lang="ts" setup>
defineProps<{
  isLight: boolean
  changeTheme: (theme: 'theme-dark' | 'theme-light') => void
}>()
</script>

<template>
  <Icon
    v-if="isLight"
    name="mdi:white-balance-sunny"
    class="is-medium mdi-white-balance-sunny"
    style="margin: auto;"
    @click="changeTheme('theme-dark')"
  />
  <Icon
    v-else
    name="mdi:moon-waning-crescent"
    class="is-medium mdi-moon-waning-crescent"
    style="margin: auto;"
    @click="changeTheme('theme-light')"
  />
</template>

<style scoped>
.mdi-white-balance-sunny {
  color: rgb(244, 186, 67);
}

.mdi-moon-waning-crescent {
  color: rgb(122, 88, 237);
}
</style>
