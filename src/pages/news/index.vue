<script setup lang="ts">
import { ref, computed } from 'vue'
import { news } from '../../composables/mockup'

const { t } = useI18n()
const searchQuery = ref('')
const localePath = useLocalePath()

const filteredNews = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return news

  return news.filter(n =>
    n.title.toLowerCase().includes(query) ||
    n.excerpt.toLowerCase().includes(query)
  )
})

const featuredNews = computed(() => filteredNews.value[0])
const regularNews = computed(() => filteredNews.value.slice(1))
</script>

<template>
  <div class="news-page">
    <UiPageHero :eyebrow="t('news.badge')" :title="t('news.titleLine1')" :emphasis="t('news.titleLine2')"
      :intro="t('news.desc')">
      <template #actions>
        <form class="news-search" role="search" @submit.prevent>
          <label class="visually-hidden" for="news-search">{{ t('news.searchLabel') }}</label>
          <input id="news-search" v-model="searchQuery" type="search" class="ui-control ui-control--pill"
            :placeholder="t('news.searchPlaceholder')">
        </form>
      </template>
    </UiPageHero>

    <template v-if="featuredNews">
      <!-- Featured News (First Item) -->
      <section class="shell news-featured" :aria-label="t('news.featured')">
        <ArticleCard variant="feature" :heading-level="2" :to="localePath(`/news/${featuredNews.id}`)"
          :image="featuredNews.thumbnail" :title="featuredNews.title" :excerpt="featuredNews.excerpt"
          :eyebrow="t('news.featured')" :meta="[featuredNews.date]" :cta="t('news.readFull')" />
      </section>

      <!-- News Grid -->
      <section v-if="regularNews.length" class="shell news-more" aria-labelledby="news-more-title">
        <div class="news-more__head">
          <h2 id="news-more-title" class="news-more__title">{{ t('news.moreStories') }}</h2>
          <p class="news-more__count">
            {{ t('news.articleCount', { count: regularNews.length }, regularNews.length) }}
          </p>
        </div>

        <ul class="news-grid" role="list">
          <li v-for="n in regularNews" :key="n.id">
            <ArticleCard :to="localePath(`/news/${n.id}`)" :image="n.thumbnail" :title="n.title" :excerpt="n.excerpt"
              :meta="[n.date]" />
          </li>
        </ul>
      </section>
    </template>

    <!-- Empty State -->
    <div v-else class="shell news-empty">
      <UiEmptyState :title="t('news.emptyTitle')" :description="t('news.emptyDesc')" />
    </div>

    <NewsletterSignup />
  </div>
</template>

<style scoped>
.news-search {
  width: 100%;
}

.news-featured {
  padding-bottom: var(--section-space);
}

.news-more {
  padding-bottom: var(--section-space);
}

.news-more__head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-4);
  padding-bottom: var(--space-4);
  margin-bottom: var(--space-fluid-md);
  border-bottom: 1px solid var(--color-border-strong);
}

.news-more__title {
  font-family: var(--font-serif);
  font-size: var(--text-h3);
  font-weight: var(--weight-regular);
}

.news-more__count {
  color: var(--color-text-muted);
  font-size: var(--text-ui);
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 18rem), 1fr));
  gap: var(--space-fluid-lg) var(--space-fluid-sm);
}

.news-empty {
  padding-bottom: var(--section-space);
}
</style>
