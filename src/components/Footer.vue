<script setup>
import { CONTACT_INFO } from '~/constants/contact';

const { t } = useI18n();
const localePath = useLocalePath();

const tourLinks = computed(() => [
    { title: t('footer.tourCategories.north'), url: localePath('/tour/city/mien-bac') },
    { title: t('footer.tourCategories.central'), url: localePath('/tour/city/mien-trung') },
    { title: t('footer.tourCategories.south'), url: localePath('/tour/city/mien-nam') },
    { title: t('footer.tourCategories.domestic'), url: localePath('/tour') },
    { title: t('footer.tourCategories.asia'), url: localePath('/tour') }
]);
</script>

<template>
    <footer class="site-footer">
        <div class="shell site-footer__grid">
            <div>
                <NuxtLink :to="localePath('/')" class="site-footer__brand">ANDAGO</NuxtLink>
                <dl class="site-footer__contact">
                    <div>
                        <dt>{{ t('footer.address') }}</dt>
                        <dd>{{ CONTACT_INFO.address }}</dd>
                    </div>
                    <div>
                        <dt>{{ t('footer.email') }}</dt>
                        <dd><a :href="`mailto:${CONTACT_INFO.email}`">{{ CONTACT_INFO.email }}</a></dd>
                    </div>
                    <div>
                        <dt>{{ t('footer.phone') }}</dt>
                        <dd>
                            <a :href="CONTACT_INFO.phoneHref">{{ CONTACT_INFO.phone }}</a>
                            ({{ CONTACT_INFO.phonePerson }})
                        </dd>
                    </div>
                </dl>
            </div>

            <nav aria-labelledby="footer-tours-title">
                <p id="footer-tours-title" class="site-footer__label">{{ t('footer.featuredTours') }}</p>
                <ul role="list" class="site-footer__links">
                    <li v-for="(link, index) in tourLinks" :key="index">
                        <NuxtLink :to="link.url">{{ link.title }}</NuxtLink>
                    </li>
                </ul>
            </nav>
        </div>
    </footer>
</template>

<style scoped>
.site-footer {
    padding-block: var(--space-fluid-lg);
    border-top: 1px solid var(--color-border);
    background: var(--color-bg);
    color: var(--color-text);
    font-family: var(--font-sans);
}

.site-footer__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
    gap: var(--space-8) var(--space-fluid-xl);
}

.site-footer__brand {
    color: var(--color-text);
    font-family: var(--font-serif);
    font-size: var(--text-4xl);
    letter-spacing: var(--tracking-wide);
    text-decoration: none;
}

.site-footer__contact {
    display: grid;
    gap: var(--space-3);
    margin-top: var(--space-5);
    color: var(--color-text-muted);
    font-size: var(--text-ui);
}

.site-footer__contact dt,
.site-footer__label {
    color: var(--color-text-muted);
    font-size: var(--text-2xs);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
}

.site-footer__contact dd {
    color: var(--color-text);
}

.site-footer__label {
    margin-bottom: var(--space-3);
}

.site-footer__links {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2) 1.75rem;
}

.site-footer a {
    color: var(--color-text);
    text-decoration: none;
}

.site-footer a:hover {
    color: var(--color-accent);
    text-decoration: underline;
    text-underline-offset: 0.25em;
}

.site-footer__links a {
    color: var(--color-text-muted);
}

.site-footer a:focus-visible {
    outline: var(--focus-ring);
    outline-offset: 2px;
}
</style>
