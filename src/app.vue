<script setup lang="ts">
useHead({
  title: 'Motobike Tours'
})
</script>

<template>
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <DefaultLayout>
      <NuxtPage />
    </DefaultLayout>
  </NuxtLayout>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Jost:ital,wght@0,100..900;1,100..900&family=Playfair+Display:ital,wght@0,700;1,700&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap');

html {
  font-family: "Open Sans", sans-serif;
  scroll-behavior: smooth;
}

body {
  @apply antialiased;
}

/* Global transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}


</style>