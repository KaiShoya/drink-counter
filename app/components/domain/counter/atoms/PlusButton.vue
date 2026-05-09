<script setup lang="ts">
defineProps<{
  clickFunction: () => void
  disabled?: boolean
}>()
</script>

<template>
  <BaseAtomsButton
    label="plus"
    :click-function="clickFunction"
    :disabled="disabled"
  >
    <Icon
      name="mdi:plus"
      class="icon"
    />
  </BaseAtomsButton>
</template>
