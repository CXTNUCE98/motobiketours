<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();
import { latestNews } from '@/data/homeData';
</script>

<template>
    <section class="latest-news" aria-labelledby="latest-news-title">
        <div class="shell">
            <UiSectionHeading id="latest-news-title" :eyebrow="t('home.latestNewsSubtitle')"
                :title="t('home.latestNewsTitle')" />

            <ul class="latest-news__grid" role="list">
                <li v-for="item in latestNews" :key="item.id">
                    <ArticleCard :to="localePath(`/news/${item.id}`)" :image="item.image || ''" :title="item.title"
                        :excerpt="item.description"
                        :meta="[item.date, t('home.newsViews', { count: item.views })]" />
                </li>
            </ul>
        </div>
    </section>
</template>

<style scoped>
.latest-news {
    padding-block: var(--section-space);
    background: var(--color-bg-subtle);
}

.latest-news__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 18rem), 1fr));
    gap: var(--space-fluid-lg) var(--space-fluid-sm);
    margin-top: var(--space-fluid-lg);
}
</style>
