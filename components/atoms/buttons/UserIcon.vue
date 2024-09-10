<script lang="ts" setup>
defineProps<{
  userAvatarUrl?: string | null
}>()
</script>

<template>
  <div class="is-vcentered">
    <div
      v-if="userAvatarUrl"
      class="image"
    >
      <img
        class="navbar-item p-0"
        :src="userAvatarUrl"
        loading="lazy"
      >
    </div>
    <div v-else>
      <Icon
        name="mdi:account-circle"
        class="is-medium"
      />
    </div>
  </div>
</template>

<style scoped>
.icon {
  color: var(--bulma-body-color);
}
</style>
