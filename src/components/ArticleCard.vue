<script setup lang="ts">
// Thẻ bài viết dùng chung cho Tin tức và Blog.
// variant "feature": ảnh lớn + nội dung cạnh nhau (bài nổi bật đầu trang).
withDefaults(defineProps<{
    to: string;
    image: string;
    title: string;
    excerpt?: string;
    eyebrow?: string;
    meta?: string[];
    author?: { name?: string; avatar?: string };
    cta?: string;
    variant?: 'card' | 'feature';
    headingLevel?: 2 | 3;
}>(), {
    excerpt: undefined,
    eyebrow: undefined,
    meta: () => [],
    author: undefined,
    cta: undefined,
    variant: 'card',
    headingLevel: 3,
});
</script>

<template>
    <article class="article-card" :class="`article-card--${variant}`">
        <div class="article-card__media">
            <img :src="image" alt="" :loading="variant === 'feature' ? 'eager' : 'lazy'" decoding="async">
        </div>

        <div class="article-card__body">
            <p v-if="eyebrow" class="article-card__eyebrow">{{ eyebrow }}</p>
            <component :is="`h${headingLevel}`" class="article-card__title">
                <NuxtLink :to="to" class="article-card__link">{{ title }}</NuxtLink>
            </component>
            <p v-if="excerpt" class="article-card__excerpt">{{ excerpt }}</p>

            <div v-if="author?.name || meta.length" class="article-card__meta">
                <img v-if="author?.avatar" :src="author.avatar" alt="" class="article-card__avatar">
                <span v-if="author?.name" class="article-card__author">{{ author.name }}</span>
                <span v-for="item in meta" :key="item">{{ item }}</span>
            </div>

            <span v-if="cta" class="article-card__cta" aria-hidden="true">{{ cta }} →</span>
        </div>
    </article>
</template>

<style scoped>
.article-card {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    border-radius: var(--radius-md);
}

.article-card:has(.article-card__link:focus-visible) {
    outline: var(--focus-ring);
    outline-offset: 6px;
}

.article-card__link {
    color: inherit;
    text-decoration: none;
    outline: none;
}

/* Link trải rộng: bấm vào bất kỳ đâu trên thẻ đều mở bài viết */
.article-card__link::after {
    content: '';
    position: absolute;
    inset: 0;
}

.article-card__media {
    aspect-ratio: 3 / 2;
    overflow: hidden;
    border-radius: var(--radius-md);
    background: var(--color-bg-subtle);
}

.article-card__media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-slow);
}

.article-card:hover .article-card__media img {
    transform: scale(1.03);
}

.article-card__body {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding-top: 1.125rem;
}

.article-card__eyebrow {
    margin-bottom: var(--space-2);
    color: var(--color-accent);
    font-size: var(--text-2xs);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
}

.article-card__title {
    font-family: var(--font-serif);
    font-size: var(--text-title);
    font-weight: var(--weight-regular);
    line-height: var(--leading-snug);
    text-wrap: balance;
    transition: color var(--transition-base);
}

.article-card:hover .article-card__title {
    color: var(--color-accent);
}

.article-card__excerpt {
    display: -webkit-box;
    margin-top: 0.625rem;
    overflow: hidden;
    color: var(--color-text-muted);
    font-size: var(--text-ui);
    line-height: var(--leading-body);
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
}

.article-card__meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-1) var(--space-3);
    margin-top: auto;
    padding-top: var(--space-4);
    color: var(--color-text-muted);
    font-size: var(--text-sm);
}

.article-card__meta > span + span::before {
    content: '·';
    margin-right: var(--space-3);
}

.article-card__avatar {
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 50%;
    object-fit: cover;
}

.article-card__author {
    color: var(--color-text);
    font-weight: var(--weight-medium);
}

.article-card__cta {
    margin-top: var(--space-6);
    color: var(--color-text);
    font-size: var(--text-ui);
    font-weight: var(--weight-medium);
    text-decoration: underline;
    text-decoration-color: var(--color-accent);
    text-underline-offset: 0.35em;
}

/* Bài nổi bật: ảnh lớn bên trái, nội dung bên phải khi đủ rộng */
.article-card--feature {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr));
    gap: var(--space-fluid-lg);
    align-items: center;
}

.article-card--feature .article-card__media {
    aspect-ratio: 4 / 3;
}

.article-card--feature .article-card__body {
    padding-top: 0;
}

.article-card--feature .article-card__title {
    font-size: var(--text-h2);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
}

.article-card--feature .article-card__excerpt {
    margin-top: var(--space-5);
    font-size: var(--text-lead);
}

.article-card--feature .article-card__meta {
    margin-top: var(--space-6);
    padding-top: 0;
}
</style>
