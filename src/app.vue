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
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Jost:ital,wght@0,100..900;1,100..900&family=Playfair+Display:ital,wght@0,700;1,700&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap');

/* Root Variables - Color Palette (webdulichdanang.com inspired) */
:root {
  --color-primary: #FF6B35;
  --color-primary-dark: #FF5722;
  --color-secondary: #FFA726;
  --color-secondary-dark: #FF9800;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: var(--color-gray-light);
}

.dark ::-webkit-scrollbar-track {
  background: #1f2937;
  /* gray-800 */
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #0aeeee, #1A71C7);
  border-radius: 10px;
  border: 2px solid var(--color-gray-light);
}

.dark ::-webkit-scrollbar-thumb {
  border-color: #1f2937;
  /* gray-800 */
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #1A71C7, #0aeeee);
}

/* Utility classes */
.btn-primary {
  @apply bg-gradient-to-r from-[#FF6B35] to-[#FF5722] text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 uppercase text-sm tracking-wide;
}

.btn-secondary {
  @apply bg-gradient-to-r from-[#FFA726] to-[#FF9800] text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 uppercase text-sm tracking-wide;
}

.card {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700;
}

.section-title {
  @apply flex items-center gap-2 mb-4 text-gray-900 dark:text-white;
}

.section-title::before {
  content: '';
  @apply w-1 h-8 bg-[#FFB800];
}

/* Link styles */
a {
  @apply transition-colors duration-300;
}

/* Image hover effects */
.img-hover {
  @apply transform hover:scale-105 transition-transform duration-500;
}
</style>