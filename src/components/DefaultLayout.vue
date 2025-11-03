<script setup lang="ts">
import Sidebar from './Sidebar.vue'
</script>

<template>
    <Header />
    <div class="pt-2">
        <div class="max-w-6xl mx-auto flex">
            <Sidebar />
            <div class="DetailC pl-2 w-full">
                <slot />
            </div>
        </div>
    </div>
    <Footer />
</template>