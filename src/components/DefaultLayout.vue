<script setup lang="ts">
import { useTheme } from '@/composables/useTheme';
const { theme } = useTheme();
</script>

<template>
    <!-- Header with full width -->
    <Header />
    
    <!-- Main Content Area -->
    <main class="py-12 md:py-20" :class="{ 'bg-#111827': theme === 'dark' }">
        <!-- <div class="max-w-7xl mx-auto px-4 md:px-6"> -->
            <slot />
        <!-- </div> -->
    </main>    
    <!-- Footer -->
    <Footer />
</template>