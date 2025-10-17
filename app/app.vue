<script setup lang="ts">
const { isLoading } = storeToRefs(useAppStore())

const { t } = useI18n()
const router = useRouter()
const currentPath = computed(() => `https://drink-counter-theta.vercel.app${router.currentRoute.value.path}`)
useSeoMeta({
  title: t(LOCALE_TITLE),
  ogUrl: currentPath,
})

const { fetchUserData } = useUserStore()
await fetchUserData()
</script>

<template>
  <div onclick="false">
    <CommonAppAtomsLoader v-show="isLoading" />
    <NuxtLayout name="custom">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
