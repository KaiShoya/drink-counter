<script setup lang="ts">
defineProps<{
  name: string,
  count: Number,
  color: string,
}>()
</script>

<template>
  <div class="columns is-gapless is-multiline is-mobile is-vcentered mb-1 p-0">
    <div
      class="ml-5"
      :style="{ padding: '5px', height: '14px', backgroundColor: color }"
    />

    <div class="column control subtitle ml-2">
      <span class="subtitle is-6">
        {{ name }}
      </span>
    </div>

    <div class="column is-1">
      <span class="subtitle is-6">
        {{ count }}
      </span>
    </div>
  </div>
</template>
