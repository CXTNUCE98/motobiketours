<script setup lang="ts">
import Sidebar from './Sidebar.vue'
</script>

<template>
    <Header />
    <div class="bg-gray-50 min-h-screen">
        <div class="max-w-7xl mx-auto flex flex-col lg:flex-row px-4 py-8 gap-8">
            <Sidebar />
            <div class="flex-1 bg-white rounded-lg shadow-soft p-6 lg:p-8">
                <slot />
            </div>
        </div>
    </div>
    <Footer />
</template>