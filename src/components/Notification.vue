<script setup lang="ts">
import type { NotificationItem } from '@/composables/notifications'
const { items, remove } = useNotifications()

const colorByType: Record<string, string> = {
  success: 'bg-green-600 text-white',
  error: 'bg-red-600 text-white',
  warning: 'bg-amber-500 text-black',
  info: 'bg-blue-600 text-white',
}

const iconByType: Record<string, string> = {
  success: '✔',
  error: '✖',
  warning: '⚠',
  info: 'ℹ',
}
</script>

<template>
  <div class="fixed top-4 right-4 z-[1000] space-y-3">
    <div v-for="n in items" :key="n.id" class="shadow-lg rounded-lg overflow-hidden min-w-[260px]">
      <div class="flex items-start gap-3 px-4 py-3" :class="colorByType[n.type]">
        <span class="text-lg leading-none">{{ iconByType[n.type] }}</span>
        <p class="text-sm leading-5 flex-1">{{ n.message }}</p>
        <button class="opacity-80 hover:opacity-100" @click="remove(n.id)">×</button>
      </div>
    </div>
  </div>
  
</template>

<style scoped>
</style>


