<script lang="ts" setup>
type ThemeClass = 'theme-light' | 'theme-dark'

const props = defineProps<{
  themePreference: ThemeClass
  resolvedTheme: ThemeClass
  changeTheme: (theme: ThemeClass) => void
  labels: {
    light: string
    dark: string
  }
}>()

const iconName = computed(() => {
  return props.resolvedTheme === 'theme-light' ? 'mdi:white-balance-sunny' : 'mdi:moon-waning-crescent'
})

const iconColor = computed(() => {
  return props.resolvedTheme === 'theme-light' ? 'rgb(244, 186, 67)' : 'rgb(122, 88, 237)'
})

const iconLabel = computed(() => {
  return props.resolvedTheme === 'theme-light' ? props.labels.light : props.labels.dark
})

const cycleTheme = () => {
  const nextTheme = props.themePreference === 'theme-light' ? 'theme-dark' : 'theme-light'
  props.changeTheme(nextTheme)
}
</script>

<template>
  <button
    class="theme-toggle"
    type="button"
    :aria-label="iconLabel"
    :title="iconLabel"
    @click="cycleTheme"
  >
    <Icon
      :name="iconName"
      class="icon is-medium"
      :style="{ color: iconColor }"
    />
  </button>
</template>

<style scoped>
.theme-toggle {
  padding: 6px;
  border: none;
  background: transparent;
  cursor: pointer;
}

.icon {
  left: 4px !important;
  top: 4px !important;
}
</style>
