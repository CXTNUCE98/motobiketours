<script setup lang="ts">
import { useTheme } from '@/composables/useTheme';
const { theme } = useTheme();
</script>

<template>
    <!-- Header with full width -->
    <Header />

    <!-- Main Content Area: header dạng sticky nên không cần chừa khoảng trống phía trên -->
    <main class="min-h-screen">
        <slot />
    </main>
    <!-- Footer -->
    <Footer />
</template>
