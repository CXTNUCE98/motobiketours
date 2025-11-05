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
    const paragraphs = Array.isArray(n.content) ? n.content.map(p => `<p>${p}</p>`).join('') : ''
    return `
    <div class="TinDetailC">
      <h1 style="padding-bottom:10px;">${n.title}</h1>
      <div class="DetailC">
        <div style="color:#6b7280;font-size:12px;">${n.date || ''}</div>
        <img src="${n.thumbnail}" alt="${n.title}" style="margin-top:12px;max-width:100%;border-radius:6px;" />
        <div style="margin-top:12px;line-height:1.6;">${paragraphs}</div>
      </div>
    </div>`
})
</script>
<template>
    <div v-html="detailHtml">
    </div>
    <div class="mt-8">
        <div class="text-16px font-bold text-#02964C uppercase mb-2">OTHER NEWS</div>
        <div class="h-1 bg-[#02964C] mb-4"></div>

        <ul class="space-y-2">
            <li v-for="rv in related" :key="rv.id" class="flex items-start gap-2">
                <span class="text-#02964C">›</span>
                <router-link :to="`/news/${rv.id}`" class="text-#1a73e8 hover:underline">
                    {{ rv.title }}
                </router-link>
            </li>
        </ul>
    </div>
</template>
<style scoped></style>