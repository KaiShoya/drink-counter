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
        class="user-icon navbar-item p-0"
        :src="userAvatarUrl"
        loading="lazy"
      >
    </div>
    <div v-else>
      <Icon
        name="mdi:account-circle"
        class="user-icon icon is-medium"
      />
    </div>
  </div>
</template>

<style scoped>
.icon {
  color: var(--bulma-body-color);
}
.user-icon {
  left: 4px !important;
  top: 4px !important;
}
</style>
