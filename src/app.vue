<script setup lang="ts">
const { initGeolocation } = useGeolocationStore();

onMounted(() => {
  initGeolocation();
});

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

/* Root Variables - Modern Travel Color Palette */
:root {
  /* Primary Colors - Ocean Blue */
  --color-primary: #0EA5E9;
  --color-primary-dark: #0284C7;
  --color-primary-light: #38BDF8;

  /* Secondary Colors - Warm Coral */
  --color-secondary: #FF6B35;
  --color-secondary-dark: #F97316;
  --color-secondary-light: #FB923C;

  /* Accent Colors */
  --color-accent: #FBBF24;
  --color-accent-dark: #F59E0B;

  /* Neutral Colors - Light Theme */
  --color-bg-primary: #FFFFFF;
  --color-bg-secondary: #F8FAFC;
  --color-bg-tertiary: #F1F5F9;
  --color-text-primary: #0F172A;
  --color-text-secondary: #475569;
  --color-text-tertiary: #64748B;
  --color-border: #E2E8F0;
  --color-border-light: #F1F5F9;
}

/* Dark Theme Variables */
.dark {
  /* Primary Colors - Cyan Neon */
  --color-primary: #06B6D4;
  --color-primary-dark: #0891B2;
  --color-primary-light: #22D3EE;

  /* Secondary Colors - Warm Orange */
  --color-secondary: #FB923C;
  --color-secondary-dark: #F97316;
  --color-secondary-light: #FDBA74;

  /* Accent Colors */
  --color-accent: #FCD34D;
  --color-accent-dark: #FBBF24;

  /* Neutral Colors - Dark Theme */
  --color-bg-primary: #0F172A;
  --color-bg-secondary: #1E293B;
  --color-bg-tertiary: #334155;
  --color-text-primary: #F8FAFC;
  --color-text-secondary: #CBD5E1;
  --color-text-tertiary: #94A3B8;
  --color-border: #334155;
  --color-border-light: #475569;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: var(--color-bg-tertiary);
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, var(--color-primary), var(--color-primary-dark));
  border-radius: 10px;
  border: 2px solid var(--color-bg-tertiary);
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, var(--color-primary-light), var(--color-primary));
}

/* Utility classes */
.btn-primary {
  @apply bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] dark:from-[#06B6D4] dark:to-[#0891B2] text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 uppercase text-sm tracking-wide;
}

.btn-secondary {
  @apply bg-gradient-to-r from-[#FF6B35] to-[#F97316] dark:from-[#FB923C] dark:to-[#F97316] text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 uppercase text-sm tracking-wide;
}

.card {
  @apply bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-slate-100 dark:border-slate-700 hover:border-sky-200 dark:hover:border-cyan-700;
}

.section-title {
  @apply flex items-center gap-2 mb-4 text-slate-900 dark:text-slate-50;
}

.section-title::before {
  content: '';
  @apply w-1 h-8 bg-gradient-to-b from-[#0EA5E9] to-[#FF6B35] dark:from-[#06B6D4] dark:to-[#FB923C] rounded-full;
}

/* Link styles */
a {
  @apply transition-all duration-300;
}

/* Image hover effects */
.img-hover {
  @apply transform hover:scale-110 transition-transform duration-500 ease-out;
}

/* Gradient backgrounds */
.gradient-primary {
  @apply bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-cyan-950;
}

.gradient-secondary {
  @apply bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-slate-900 dark:via-orange-950 dark:to-amber-950;
}

/* Text gradients */
.text-gradient-primary {
  @apply bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] bg-clip-text text-transparent;
}

.text-gradient-secondary {
  @apply bg-gradient-to-r from-[#FF6B35] to-[#FBBF24] bg-clip-text text-transparent;
}
</style>