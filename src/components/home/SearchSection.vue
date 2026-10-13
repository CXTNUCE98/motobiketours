<script setup lang="ts">
import { ref, computed } from 'vue';
import { locations } from '@/data/homeData';
import { logger } from '~/utils/logger';

const { t } = useI18n();
const router = useRouter();

const searchForm = ref({
    keyword: '',
    location: 'all',
    duration: ''
});

const translatedLocations = computed(() => {
    return locations.map(loc => ({
        ...loc,
        label: loc.value === 'all' ? t('tour.all') : loc.label
    }));
});
const durationOptions = computed(() => [
    { value: '', label: t('tour.durationUnit') },
    { value: '1-3', label: `1-3 ${t('tour.durationUnit')}` },
    { value: '4-7', label: `4-7 ${t('tour.durationUnit')}` },
    { value: '8+', label: `8+ ${t('tour.durationUnit')}` },
]);

// "Tìm kiếm..." dùng chung với placeholder ô tìm kiếm, bỏ dấu "..." để làm nhãn nút.
const searchCta = computed(() => t('common.searchPlaceholder').replace('...', ''));

const handleSearch = () => {
    logger.log('Search:', searchForm.value);
    router.push({
        path: '/tour',
        query: {
            keyword: searchForm.value.keyword || undefined,
            location: searchForm.value.location !== 'all' ? searchForm.value.location : undefined,
            duration: searchForm.value.duration || undefined
        }
    });
};
</script>

<template>
    <section class="search-section" aria-labelledby="search-title">
        <div class="shell">
            <UiSectionHeading id="search-title" :eyebrow="t('home.discoverVN')" :title="t('home.searchBestTrip')"
                :emphasis="t('home.best')" :lead="t('home.searchExp')" />

            <form class="search-form" @submit.prevent="handleSearch">
                <UiField :label="t('home.searchKeyword')" v-slot="{ id }">
                    <input :id="id" v-model="searchForm.keyword" type="text" class="ui-control"
                        :placeholder="t('home.searchPlaceholder')">
                </UiField>

                <UiField :label="t('home.searchDest')" v-slot="{ id }">
                    <select :id="id" v-model="searchForm.location" class="ui-control">
                        <option v-for="loc in translatedLocations" :key="loc.value" :value="loc.value">
                            {{ loc.label }}
                        </option>
                    </select>
                </UiField>

                <UiField :label="t('tour.duration')" v-slot="{ id }">
                    <select :id="id" v-model="searchForm.duration" class="ui-control">
                        <option v-for="option in durationOptions" :key="option.value" :value="option.value">
                            {{ option.label }}
                        </option>
                    </select>
                </UiField>

                <UiButton type="submit" class="search-form__submit">{{ searchCta }}</UiButton>
            </form>
        </div>
    </section>
</template>

<style scoped>
.search-section {
    padding-bottom: var(--section-space);
}

.search-form {
    display: flex;
    flex-wrap: wrap;
    align-items: end;
    gap: var(--space-4) var(--space-fluid-sm);
    margin-top: var(--space-fluid-lg);
    padding: var(--space-fluid-sm) var(--space-fluid-md);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    background: var(--color-bg-subtle);
}

.search-form :deep(.ui-field) {
    flex: 1 1 14rem;
}

.search-form__submit {
    flex: 0 0 auto;
}

@media (max-width: 36rem) {
    .search-form__submit {
        flex-basis: 100%;
    }
}
</style>
