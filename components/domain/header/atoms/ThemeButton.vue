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
    class="icon is-medium"
    style="color: rgb(244, 186, 67);"
    @click="changeTheme('theme-dark')"
  />
  <Icon
    v-else
    name="mdi:moon-waning-crescent"
    class="icon is-medium"
    style="color: rgb(122, 88, 237);"
    @click="changeTheme('theme-light')"
  />
</template>

<style scoped>
.icon {
  left: 4px !important;
  top: 4px !important;
}
</style>
