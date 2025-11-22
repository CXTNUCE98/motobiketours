<script setup lang="ts">
import { useTheme } from '@/composables/useTheme';
const { theme } = useTheme();
</script>

<template>
    <!-- Header with full width -->
    <Header />
    
    <!-- Main Content Area -->
    <main class="py-12 md:py-20 bg-slate-50 dark:bg-slate-900 transition-colors duration-300 min-h-screen">
        <!-- <div class="max-w-7xl mx-auto px-4 md:px-6"> -->
            <slot />
        <!-- </div> -->
    </main>    
    <!-- Footer -->
    <Footer />
</template>