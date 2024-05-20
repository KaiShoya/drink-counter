<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAppStore } from '~/store/app'

const { isLoading } = storeToRefs(useAppStore())

</script>

<template>
  <div onclick="false">
    <OrganismsAppLoader v-show="isLoading" />
    <NuxtLayout name="custom">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
