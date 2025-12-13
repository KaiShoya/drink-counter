<script lang="ts" setup>
type ThemeClass = 'theme-light' | 'theme-dark'
type ThemePreference = ThemeClass | 'theme-system'

const props = defineProps<{
  themePreference: ThemePreference
  resolvedTheme: ThemeClass
  changeTheme: (theme: ThemePreference) => void
  labels: {
    system: string
    light: string
    dark: string
  }
}>()

const orderedThemes: ThemePreference[] = ['theme-system', 'theme-light', 'theme-dark']

const iconName = computed(() => {
  if (props.themePreference === 'theme-system') return 'mdi:monitor-dashboard'
  if (props.resolvedTheme === 'theme-light') return 'mdi:white-balance-sunny'
  return 'mdi:moon-waning-crescent'
})

const iconColor = computed(() => {
  if (props.themePreference === 'theme-system') return 'rgb(61, 141, 255)'
  if (props.resolvedTheme === 'theme-light') return 'rgb(244, 186, 67)'
  return 'rgb(122, 88, 237)'
})

const iconLabel = computed(() => {
  if (props.themePreference === 'theme-system') return props.labels.system
  if (props.resolvedTheme === 'theme-light') return props.labels.light
  return props.labels.dark
})

const cycleTheme = () => {
  const currentIndex = orderedThemes.indexOf(props.themePreference)
  const nextIndex = (currentIndex + 1) % orderedThemes.length
  props.changeTheme(orderedThemes[nextIndex])
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
