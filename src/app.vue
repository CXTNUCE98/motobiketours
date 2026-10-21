<script setup lang="ts">
const { initGeolocation } = useGeolocationStore();

onMounted(() => {
  initGeolocation();
});

// Tên website cấu hình trong admin (Cấu hình → Chung)
const { general } = useSiteSettings();
useHead({
  title: () => general.value?.siteName || 'Andago Tours'
})
</script>

<template>
  <NuxtLayout>
    <NuxtLoadingIndicator color="var(--color-accent)" />
    <DefaultLayout>
      <NuxtPage />
    </DefaultLayout>
    <Notification />
  </NuxtLayout>
</template>
