<script
  setup
  lang="ts"
>
defineProps<{
  clickFunction: Function,
}>()
</script>
<template>
  <button
    class="column is-2 button is-large"
    @click="() => { clickFunction() }"
  >
    &lt;
  </button>
</template>
