<script setup lang="ts">
import { ref, computed } from 'vue';
import { services } from '../../composables/services';
import { useI18n } from 'vue-i18n';

const searchQuery = ref('');
const { t } = useI18n();
const localePath = useLocalePath();

const filteredServices = computed(() => {
    if (!searchQuery.value) return services;

    const query = searchQuery.value.toLowerCase();
    return services.filter(service =>
        service.title.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query) ||
        service.features.some(f => f.toLowerCase().includes(query))
    );
});
</script>

<template>
    <div class="service-page">
        <UiPageHero :eyebrow="t('service.professionalService')" :title="t('service.solution')"
            :emphasis="t('service.perfectExperience')" :intro="t('service.professionalServiceDesc')">
            <template #actions>
                <form class="service-search" role="search" @submit.prevent>
                    <label class="visually-hidden" for="service-search">{{ t('service.filter') }}</label>
                    <input id="service-search" v-model="searchQuery" type="search" class="ui-control ui-control--pill"
                        :placeholder="t('service.filter')">
                </form>
            </template>
        </UiPageHero>

        <section class="shell service-grid-section" :aria-label="t('service.service')">
            <ul v-if="filteredServices.length" class="service-grid" role="list">
                <li v-for="service in filteredServices" :key="service.id">
                    <ArticleCard :to="localePath(`/service/${service.id}`)" :image="service.thumbnail"
                        :title="service.shortTitle" :excerpt="service.description" :eyebrow="service.priceRange"
                        :meta="service.duration ? [service.duration] : []" :cta="t('common.viewDetails')" />
                </li>
            </ul>

            <UiEmptyState v-else :title="t('service.list.emptyTitle')" :description="t('service.list.emptyDesc')">
                <UiButton variant="outline" @click="searchQuery = ''">{{ t('service.list.clearSearch') }}</UiButton>
            </UiEmptyState>
        </section>

        <section class="service-why" aria-labelledby="service-why-title">
            <div class="shell">
                <UiSectionHeading id="service-why-title" :title="t('service.whyChooseUs')" />

                <ul class="service-why__grid" role="list">
                    <li>
                        <h3>{{ t('service.safetyInsurance') }}</h3>
                        <p>{{ t('service.safetyInsuranceDesc') }}</p>
                    </li>
                    <li>
                        <h3>{{ t('service.professional') }}</h3>
                        <p>{{ t('service.professionalDesc') }}</p>
                    </li>
                    <li>
                        <h3>{{ t('service.support247') }}</h3>
                        <p>{{ t('service.support247Desc') }}</p>
                    </li>
                </ul>
            </div>
        </section>
    </div>
</template>

<style scoped>
.service-search {
    width: 100%;
}

.service-grid-section {
    padding-bottom: var(--section-space);
}

.service-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 18rem), 1fr));
    gap: var(--space-fluid-lg) var(--space-fluid-sm);
}

.service-why {
    padding-block: var(--section-space);
    background: var(--color-inverse-bg);
    color: var(--color-inverse-text);
    --em-color: var(--color-inverse-accent);
    --eyebrow-color: var(--color-inverse-accent);
    --lead-color: var(--color-inverse-muted);
}

.service-why__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
    gap: var(--space-fluid-lg);
    margin-top: var(--space-fluid-lg);
    padding-top: var(--space-fluid-lg);
    border-top: 1px solid var(--color-inverse-border);
}

.service-why__grid h3 {
    margin-bottom: var(--space-2);
    font-family: var(--font-serif);
    font-size: var(--text-title);
    font-weight: var(--weight-regular);
}

.service-why__grid p {
    color: var(--color-inverse-muted);
    line-height: var(--leading-body);
}
</style>
