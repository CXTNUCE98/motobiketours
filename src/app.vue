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
    <Notification />
  </NuxtLayout>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@600;700;800&display=swap');

html {
  font-family: "Inter", "Poppins", sans-serif;
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