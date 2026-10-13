<script setup lang="ts">
const props = defineProps<{
    page: number;
    totalPages: number;
}>();

const emit = defineEmits<{
    (e: 'update:page', value: number): void;
}>();

const { t } = useI18n();

// Trang đầu, trang cuối, trang hiện tại ±1; khoảng bị lược hiển thị "…"
const items = computed(() => {
    const list: (number | 'gap')[] = [];
    for (let p = 1; p <= props.totalPages; p++) {
        if (p === 1 || p === props.totalPages || Math.abs(p - props.page) <= 1) {
            list.push(p);
        } else if (list[list.length - 1] !== 'gap') {
            list.push('gap');
        }
    }
    return list;
});

const goTo = (value: number) => {
    if (value >= 1 && value <= props.totalPages && value !== props.page) {
        emit('update:page', value);
    }
};
</script>

<template>
    <nav v-if="totalPages > 1" class="ui-pagination" :aria-label="t('common.pagination')">
        <button type="button" class="ui-pagination__step" :disabled="page <= 1" @click="goTo(page - 1)">
            <span aria-hidden="true">←</span> {{ t('common.previousPage') }}
        </button>

        <ol class="ui-pagination__pages" role="list">
            <li v-for="(item, index) in items" :key="index">
                <span v-if="item === 'gap'" class="ui-pagination__gap" aria-hidden="true">…</span>
                <button v-else type="button" class="ui-pagination__page"
                    :aria-current="item === page ? 'page' : undefined" @click="goTo(item)">
                    {{ item }}
                </button>
            </li>
        </ol>

        <button type="button" class="ui-pagination__step" :disabled="page >= totalPages" @click="goTo(page + 1)">
            {{ t('common.nextPage') }} <span aria-hidden="true">→</span>
        </button>
    </nav>
</template>

<style scoped>
.ui-pagination {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
    padding-top: var(--space-6);
    border-top: 1px solid var(--color-border);
}

.ui-pagination__pages {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-1);
}

.ui-pagination__page,
.ui-pagination__step {
    min-height: 2.5rem;
    border-radius: var(--radius-pill);
    color: var(--color-text-muted);
    font-size: var(--text-ui);
    transition: background-color var(--transition-base), color var(--transition-base);
}

.ui-pagination__page {
    min-width: 2.5rem;
    font-family: var(--font-serif);
    font-size: var(--text-lg);
    font-variant-numeric: lining-nums;
}

.ui-pagination__step {
    padding: 0 var(--space-3);
}

.ui-pagination__page:hover,
.ui-pagination__step:hover:not(:disabled) {
    color: var(--color-text);
}

.ui-pagination__page[aria-current='page'] {
    background: var(--color-text);
    color: var(--color-bg);
}

.ui-pagination__step:disabled {
    cursor: not-allowed;
    opacity: 0.4;
}

.ui-pagination__gap {
    display: inline-flex;
    align-items: center;
    min-height: 2.5rem;
    padding-inline: var(--space-2);
    color: var(--color-text-muted);
}

.ui-pagination button:focus-visible {
    outline: var(--focus-ring);
    outline-offset: 2px;
}
</style>
