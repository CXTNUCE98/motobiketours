<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { news } from '../../composables/mockup'
import { sanitizeHtml } from '~/utils/sanitize'

const route = useRoute()
const { t } = useI18n()
const localePath = useLocalePath()

const id = computed(() => String(route.params.id))
const item = computed(() => news.find(n => n.id === id.value))
const related = computed(() => news.filter(n => n.id !== id.value).slice(0, 3))

function share() {
    const w = globalThis as any
    const url = encodeURIComponent(w.location?.href || '')
    const text = encodeURIComponent(item.value?.title || '')
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`
    if (typeof w.open === 'function') w.open(shareUrl, '_blank')
}

// Nội dung bài viết (ưu tiên contentHtml có sẵn, nếu không thì ghép từ mảng đoạn văn).
// Bỏ thẻ <h1> đầu tiên (nếu có) trong dữ liệu mock vì tiêu đề đã hiển thị ở đầu trang.
const detailHtml = computed(() => {
    const n = item.value
    if (!n) return ''
    let html = ''
    if (n.contentHtml) html = n.contentHtml
    else if (Array.isArray(n.content)) html = n.content.map(p => `<p>${p}</p>`).join('')
    return html.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, '')
})

const plainText = computed(() => {
    const n = item.value
    if (!n) return ''
    if (n.contentHtml) return n.contentHtml.replace(/<[^>]*>/g, ' ')
    if (Array.isArray(n.content)) return n.content.join(' ')
    return ''
})

const readTime = computed(() => {
    const words = plainText.value.trim().split(/\s+/).filter(Boolean).length
    return Math.max(1, Math.ceil(words / 180))
})
</script>

<template>
    <div v-if="item" class="news-detail">
        <header class="shell news-detail__head">
            <p class="news-detail__eyebrow">
                <NuxtLink :to="localePath('/news')">{{ t('news.badge') }}</NuxtLink>
            </p>
            <h1 class="news-detail__title">{{ item.title }}</h1>
            <p class="news-detail__meta">
                <span>{{ item.date }}</span>
                <span>{{ t('blog.readTime', { count: readTime }) }}</span>
                <button type="button" class="news-detail__share" @click="share">{{ t('news.detail.share') }}</button>
            </p>
        </header>

        <div class="shell news-detail__cover">
            <img :src="item.thumbnail" :alt="item.title" loading="eager" decoding="async">
        </div>

        <div class="shell">
            <div class="news-detail__measure prose" v-html="sanitizeHtml(detailHtml)" />
        </div>

        <section v-if="related.length" class="shell news-detail__related" :aria-label="t('news.detail.otherNews')">
            <h2 class="news-detail__related-title">{{ t('news.detail.otherNews') }}</h2>
            <ul class="news-detail__related-grid" role="list">
                <li v-for="rv in related" :key="rv.id">
                    <ArticleCard :to="localePath(`/news/${rv.id}`)" :image="rv.thumbnail" :title="rv.title"
                        :excerpt="rv.excerpt" :meta="[rv.date]" />
                </li>
            </ul>
        </section>
    </div>

    <div v-else class="shell news-detail__notfound">
        <UiEmptyState :title="t('news.detail.notFound')" :description="t('news.detail.notFoundDesc')">
            <UiButton :to="localePath('/news')">{{ t('news.detail.backToNews') }}</UiButton>
        </UiEmptyState>
    </div>
</template>

<style scoped>
.news-detail__head {
    padding-top: var(--space-page-top);
    padding-bottom: var(--space-fluid-lg);
}

.news-detail__eyebrow {
    margin-bottom: var(--space-5);
}

.news-detail__eyebrow a {
    display: inline-flex;
    align-items: center;
    gap: var(--space-3);
    color: var(--color-accent);
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-label);
    text-decoration: none;
    text-transform: uppercase;
}

.news-detail__eyebrow a::before {
    content: '';
    flex-shrink: 0;
    width: 2.5rem;
    height: 1px;
    background: currentColor;
}

.news-detail__title {
    max-width: 50rem;
    font-family: var(--font-serif);
    font-size: var(--text-display);
    font-weight: var(--weight-regular);
    line-height: var(--leading-display);
    letter-spacing: var(--tracking-display);
    text-wrap: balance;
}

.news-detail__meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-1) var(--space-3);
    margin-top: var(--space-6);
    color: var(--color-text-muted);
    font-size: var(--text-ui);
}

.news-detail__meta > * + *::before {
    content: '·';
    margin-right: var(--space-3);
}

.news-detail__share {
    color: var(--color-text);
    font-weight: var(--weight-medium);
    text-decoration: underline;
    text-decoration-color: var(--color-accent);
    text-underline-offset: 0.3em;
}

.news-detail__share:focus-visible {
    outline: var(--focus-ring);
    outline-offset: 3px;
}

.news-detail__cover {
    margin-bottom: var(--space-block);
}

.news-detail__cover img {
    width: 100%;
    max-height: 32rem;
    border-radius: var(--radius-md);
    object-fit: cover;
    background: var(--color-bg-subtle);
}

.news-detail__measure {
    max-width: 42rem;
    margin-inline: auto;
    padding-bottom: var(--space-block);
}

/* Kiểu chữ cho nội dung v-html */
.prose :deep(h1),
.prose :deep(h2),
.prose :deep(h3),
.prose :deep(h4) {
    margin-top: var(--space-8);
    margin-bottom: var(--space-3);
    font-family: var(--font-serif);
    font-weight: var(--weight-regular);
    line-height: var(--leading-snug);
}

.prose :deep(h1) {
    font-size: var(--text-h3);
}

.prose :deep(h2) {
    font-size: var(--text-title-lg);
}

.prose :deep(h3) {
    font-size: var(--text-title);
}

.prose :deep(p) {
    margin-bottom: var(--space-5);
    color: var(--color-text);
    font-size: var(--text-lead);
    line-height: var(--leading-body);
}

.prose :deep(a) {
    color: var(--color-accent);
    text-decoration: underline;
    text-underline-offset: 0.2em;
}

.prose :deep(strong) {
    font-weight: var(--weight-semibold);
}

.prose :deep(ul),
.prose :deep(ol) {
    margin: 0 0 var(--space-5) var(--space-5);
    color: var(--color-text);
    line-height: var(--leading-body);
}

.prose :deep(img) {
    display: block;
    width: 100% !important;
    height: auto !important;
    margin-block: var(--space-6);
    border-radius: var(--radius-md);
}

.prose :deep(blockquote) {
    margin-block: var(--space-6);
    padding-left: var(--space-5);
    border-left: 2px solid var(--color-accent);
    color: var(--color-text-muted);
    font-family: var(--font-serif);
    font-size: var(--text-lead);
    font-style: italic;
}

.prose :deep(table) {
    display: block;
    width: 100%;
    margin-block: var(--space-6);
    overflow-x: auto;
    border-collapse: collapse;
    font-size: var(--text-sm);
}

.prose :deep(td),
.prose :deep(th) {
    padding: var(--space-2) var(--space-3);
    border: 1px solid var(--color-border);
    text-align: left;
}

.news-detail__related {
    padding-bottom: var(--section-space);
    margin-top: var(--space-block);
    border-top: 1px solid var(--color-border-strong);
}

.news-detail__related-title {
    padding-top: var(--space-fluid-lg);
    margin-bottom: var(--space-fluid-md);
    font-family: var(--font-serif);
    font-size: var(--text-h3);
    font-weight: var(--weight-regular);
}

.news-detail__related-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
    gap: var(--space-fluid-lg) var(--space-fluid-sm);
}

.news-detail__notfound {
    padding-block: var(--section-space);
}
</style>
