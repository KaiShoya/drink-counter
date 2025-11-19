<script setup lang="ts">
const { isLoading } = storeToRefs(useAppStore())

const { t } = useI18n()
const router = useRouter()
const currentPath = computed(() => `https://drink-counter-theta.vercel.app${router.currentRoute.value.path}`)
useSeoMeta({
  title: t(LOCALE_TITLE),
  ogUrl: currentPath,
})

const { showLoading, hideLoading } = useAppStore()
const { fetchUserData } = useUserStore()
const { fetchDrinkLabels } = useDrinkLabelsStore()
const { fetchDrinks } = useDrinksStore()

showLoading()
try {
  await fetchUserData()
  await Promise.all([
    fetchDrinkLabels(),
    fetchDrinks(),
  ])
} catch (error) {
  logger.error('Failed to fetch initial data', { module: 'app.vue' }, error)
} finally {
  hideLoading()
}
</script>

<template>
  <div onclick="false">
    <CommonAppAtomsLoader v-show="isLoading" />
    <NuxtLayout name="custom">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
