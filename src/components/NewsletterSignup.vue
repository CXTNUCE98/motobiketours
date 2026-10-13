<script setup lang="ts">
import { logger } from '~/utils/logger';

const { t } = useI18n();
const email = ref('');

const handleSubmit = () => {
    logger.log('Newsletter signup:', email.value);
    // TODO: Implement newsletter signup functionality (giống HomeNewsletter)
};
</script>

<template>
    <section class="newsletter" aria-labelledby="newsletter-title">
        <div class="shell newsletter__inner">
            <UiSectionHeading id="newsletter-title" :eyebrow="t('home.newsletterSubtitle')"
                :title="t('home.newsletterTitle')" />

            <form class="newsletter__form" @submit.prevent="handleSubmit">
                <label class="visually-hidden" for="newsletter-email">{{ t('home.newsletterEmailPlaceholder')
                    }}</label>
                <input id="newsletter-email" v-model="email" type="email" class="ui-control ui-control--pill" autocomplete="email"
                    :placeholder="t('home.newsletterEmailPlaceholder')">
                <UiButton type="submit">{{ t('home.newsletterSubscribe') }}</UiButton>
            </form>
        </div>
    </section>
</template>

<style scoped>
.newsletter {
    padding-block: var(--section-space);
    border-top: 1px solid var(--color-border);
}

.newsletter__inner {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr));
    gap: var(--space-8) var(--space-fluid-xl);
    align-items: end;
}

.newsletter__form {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
}

.newsletter__form .ui-control {
    flex: 1 1 14rem;
}
</style>
