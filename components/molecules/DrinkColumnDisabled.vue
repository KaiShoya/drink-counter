<script
  setup
  lang="ts"
>
defineProps<{
  name: string,
  count: Number,
  color: string,
}>()
</script>

<template>
  <div class="columns is-gapless is-multiline is-mobile is-vcentered m-auto">
    <div
      class="ml-1"
      :style="{ padding: '5px', height: '38px', backgroundColor: color }"
    />

    <div class="column subtitle ml-2">
      {{ name }}
    </div>

    <div class="column is-1">
      <span class="subtitle">{{ count }}</span>
    </div>
  </div>
</template>
