<script setup lang="ts">
// @ts-nocheck
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { news } from '../../composables/mockup'

const route = useRoute()
const id = computed(() => String(route.params.id))
const item = computed(() => news.find(n => n.id === id.value))
const related = computed(() => news.filter(n => n.id !== id.value).slice(0, 6))

function share() {
    const w = globalThis as any
    const url = encodeURIComponent(w.location?.href || '')
    const text = encodeURIComponent(item.value?.title || 'News')
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`
    if (typeof w.open === 'function') w.open(shareUrl, '_blank')
}

// Build HTML for rendering via v-html; fallback when contentHtml is missing
const detailHtml = computed(() => {
    const n = item.value
    if (!n) return ''
    if (n.contentHtml) return n.contentHtml
    const paragraphs = Array.isArray(n.content) ? n.content.map(p => `<p class="mb-4">${p}</p>`).join('') : ''
    return `
    <div class="TinDetailC">
      <h1 class="text-3xl font-bold mb-4 text-gray-900 dark:text-white">${n.title}</h1>
      <div class="DetailC">
        <div class="text-sm text-gray-500 dark:text-gray-400 mb-4">${n.date || ''}</div>
        <img src="${n.thumbnail}" alt="${n.title}" class="w-full rounded-lg mb-6" />
        <div class="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
            ${paragraphs}
        </div>
      </div>
    </div>`
})
</script>
<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 py-8 px-4">
        <div class="max-w-4xl mx-auto">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-transparent dark:border-gray-700"
                v-html="detailHtml">
            </div>

            <div class="mt-8">
                <div class="flex items-center gap-2 mb-4">
                    <i class="bx bx-news text-[#FF6B35] text-2xl"></i>
                    <h2 class="text-2xl font-bold text-gray-800 dark:text-white">OTHER NEWS</h2>
                </div>

                <ul class="space-y-3">
                    <li v-for="rv in related" :key="rv.id" class="group">
                        <router-link :to="`/news/${rv.id}`"
                            class="flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 hover:bg-gradient-to-r hover:from-[#FFF5F0] hover:to-[#FFE8E0] dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-300 shadow-sm hover:shadow-md border border-transparent dark:border-gray-700">
                            <i
                                class="bx bx-chevron-right text-[#FF6B35] text-xl mt-0.5 group-hover:translate-x-1 transition-transform"></i>
                            <span
                                class="text-gray-700 dark:text-gray-300 group-hover:text-[#FF6B35] dark:group-hover:text-[#FF6B35] font-medium transition-colors">{{
                                rv.title }}</span>
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<style scoped></style>