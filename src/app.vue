<script setup lang="ts">
const { initGeolocation } = useGeolocationStore();

onMounted(() => {
  initGeolocation();
});

useHead({
  title: 'Andago Tours'
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
