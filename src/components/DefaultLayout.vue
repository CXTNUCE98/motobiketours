<script setup lang="ts">
</script>

<template>
    <!-- Header with full width -->
    <Header />
    
    <!-- Main Content Area -->
    <main class="py-8 bg-gray-50">
        <!-- <div class="max-w-7xl mx-auto px-4 md:px-6"> -->
            <slot />
        <!-- </div> -->
    </main>
    
    <!-- Footer -->
    <Footer />
</template>