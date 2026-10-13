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

<style>
/*
 * Token & style gốc nằm ở src/assets/css/tokens.css và base.css (khai báo trong nuxt.config.ts).
 * File này chỉ giữ các lớp tiện ích cũ còn được dùng, đã trỏ về token.
 */

a {
  transition: color var(--transition-base), background-color var(--transition-base),
    border-color var(--transition-base), opacity var(--transition-base);
}

/* Lớp cũ còn được dùng ở luồng đặt tour — hiển thị theo token mới */
.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  min-height: 2.75rem;
  padding: 0 var(--space-6);
  border: 1px solid transparent;
  border-radius: var(--radius-pill);
  font-size: var(--text-ui);
  font-weight: var(--weight-medium);
  transition: background-color var(--transition-base), color var(--transition-base);
}

.btn-primary {
  background: var(--color-accent);
  color: var(--color-on-accent);
}

.btn-primary:hover {
  background: var(--color-accent-hover);
}

.btn-secondary {
  border-color: var(--color-text);
  color: var(--color-text);
}

.btn-secondary:hover {
  background: var(--color-text);
  color: var(--color-bg);
}

.card {
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
</style>
