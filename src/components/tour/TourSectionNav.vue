<script setup lang="ts">
// Mục lục dính dưới header: nhảy tới từng phần của trang tour, đánh dấu phần đang đọc
const props = defineProps<{
    sections: Array<{ id: string; label: string }>;
}>();

const { t } = useI18n();
const activeId = ref(props.sections[0]?.id || '');

let frame = 0;
const updateActive = () => {
    frame = 0;
    // Phần đang đọc: phần cuối cùng có mép trên đã đi qua header + thanh mục lục
    const offset = (document.querySelector('.site-header')?.getBoundingClientRect().height || 72) + 96;
    let current = props.sections[0]?.id || '';
    for (const section of props.sections) {
        const el = document.getElementById(section.id);
        if (el && el.getBoundingClientRect().top <= offset) current = section.id;
    }
    activeId.value = current;
};

const onScroll = () => {
    if (!frame) frame = requestAnimationFrame(updateActive);
};

onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true });
    updateActive();
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll);
    if (frame) cancelAnimationFrame(frame);
});
</script>

<template>
    <nav class="tour-nav" :aria-label="t('tour.sectionNav')">
        <ul class="tour-nav__list" role="list">
            <li v-for="section in sections" :key="section.id">
                <a :href="`#${section.id}`" class="tour-nav__link"
                    :aria-current="activeId === section.id ? 'true' : undefined">{{ section.label }}</a>
            </li>
        </ul>
    </nav>
</template>

<style scoped>
.tour-nav {
    position: sticky;
    top: var(--header-height);
    z-index: 10;
    border-bottom: 1px solid var(--color-border);
    background: var(--color-bg);
}

.tour-nav__list {
    display: flex;
    gap: var(--space-6);
    overflow-x: auto;
    scrollbar-width: none;
}

.tour-nav__list::-webkit-scrollbar {
    display: none;
}

.tour-nav__link {
    display: block;
    padding-block: var(--space-4);
    color: var(--color-text-muted);
    font-size: var(--text-ui);
    text-decoration: none;
    white-space: nowrap;
    box-shadow: inset 0 -2px 0 transparent;
    transition: color var(--transition-base), box-shadow var(--transition-base);
}

.tour-nav__link:hover {
    color: var(--color-text);
}

.tour-nav__link[aria-current='true'] {
    color: var(--color-text);
    box-shadow: inset 0 -2px 0 var(--color-accent);
}

.tour-nav__link:focus-visible {
    outline: var(--focus-ring);
    outline-offset: -2px;
}
</style>
