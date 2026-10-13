<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const { locale, formatPrice } = useCurrency();
const { t } = useI18n();

type FilterOptions = {
    searchQuery?: string;
    duration: string;
    priceRange: { min: number; max: number };
    tourTypes: string[];
    departFrom: string;
};

const emit = defineEmits<{
    (e: 'apply', filters: FilterOptions): void;
    (e: 'clear'): void;
}>();

const props = defineProps<{
    showMobile?: boolean;
    initialFilters?: FilterOptions;
}>();

// Hai instance (sidebar + bottom sheet mobile) cần id khác nhau
const idPrefix = props.showMobile ? 'tour-filter-sheet' : 'tour-filter';

// Filter state
const searchQuery = ref(props.initialFilters?.searchQuery || '');
const selectedDuration = ref<string>(props.initialFilters?.duration || '');
const priceMin = ref(props.initialFilters?.priceRange?.min || 0);
const priceMax = ref(props.initialFilters?.priceRange?.max || 2000);
const selectedTypes = ref<string[]>(props.initialFilters?.tourTypes || []);
const selectedDepartFrom = ref(props.initialFilters?.departFrom || 'all');

watch(() => props.initialFilters, (newFilters) => {
    if (newFilters) {
        searchQuery.value = newFilters.searchQuery || '';
        selectedDuration.value = newFilters.duration || '';
        priceMin.value = newFilters.priceRange?.min || 0;
        priceMax.value = newFilters.priceRange?.max || 2000;
        selectedTypes.value = newFilters.tourTypes || [];
        selectedDepartFrom.value = newFilters.departFrom || 'all';
    }
}, { deep: true });


// Options
const durationOptions = computed(() => [
    { value: '1-3', label: `1-3 ${t('tour.durationUnit', 'ngày')}` },
    { value: '4-7', label: `4-7 ${t('tour.durationUnit', 'ngày')}` },
    { value: '8+', label: `8+ ${t('tour.durationUnit', 'ngày')}` },
]);

const tourTypeOptions = computed(() => {
    return [
        { value: 'Adventure', label: t('tour.types.Adventure') },
        { value: 'Culture', label: t('tour.types.Culture') },
        { value: 'Nature', label: t('tour.types.Nature') },
        { value: 'Food', label: t('tour.types.Food') },
    ];
});

const departFromOptions = computed(() => [
    { value: 'all', label: t('tour.all') },
    { value: 'Sài Gòn', label: t('tour.locations.sai_gon') },
    { value: 'Hà Nội', label: t('tour.locations.ha_noi') },
    { value: 'Đà Nẵng', label: t('tour.locations.da_nang') },
    { value: 'Huế', label: t('tour.locations.hue') },
    { value: 'Hội An', label: t('tour.locations.hoi_an') },
    { value: 'Đà Lạt', label: t('tour.locations.da_lat') },
    { value: 'Nha Trang', label: t('tour.locations.nha_trang') },
    { value: 'Mũi Né', label: t('tour.locations.mui_ne') },
    { value: 'Hà Giang', label: t('tour.locations.ha_giang') },
    { value: 'Sapa', label: t('tour.locations.sapa') },
    { value: 'Phú Quốc', label: t('tour.locations.phu_quoc') },
]);

const activeFilterCount = computed(() => {
    let count = 0;
    if (selectedDuration.value) count++;
    if (priceMin.value > 0 || priceMax.value < 2000) count++;
    if (selectedTypes.value.length > 0) count++;
    if (selectedDepartFrom.value && selectedDepartFrom.value !== 'all') count++;
    return count;
});

const toggleDuration = (value: string) => {
    // Toggle: nếu đã chọn thì bỏ chọn, nếu chưa thì chọn
    if (selectedDuration.value === value) {
        selectedDuration.value = '';
    } else {
        selectedDuration.value = value;
    }
    // Tự động apply filters khi duration thay đổi
    applyFilters();
};

const applyFilters = () => {
    emit('apply', {
        searchQuery: searchQuery.value,
        duration: selectedDuration.value,
        priceRange: { min: priceMin.value, max: priceMax.value },
        tourTypes: selectedTypes.value,
        departFrom: selectedDepartFrom.value !== 'all' ? selectedDepartFrom.value : '',
    });
};

const clearFilters = () => {
    searchQuery.value = '';
    selectedDuration.value = '';
    priceMin.value = 0;
    priceMax.value = 2000;
    selectedTypes.value = [];
    selectedDepartFrom.value = 'all';
    emit('clear');
};
</script>

<template>
    <div class="tour-filter" :class="{ 'tour-filter--sheet': props.showMobile }">
        <div v-if="!props.showMobile" class="tour-filter__head">
            <p class="tour-filter__title">{{ t('tour.filter.title') }}</p>
            <span v-if="activeFilterCount > 0" class="tour-filter__count">{{ activeFilterCount }}</span>
        </div>

        <div class="tour-filter__body">
            <!-- Search -->
            <form class="tour-filter__group" role="search" @submit.prevent="applyFilters">
                <UiField :id="`${idPrefix}-search`" :label="t('tour.filter.search')">
                    <template #default="{ id }">
                        <input :id="id" v-model="searchQuery" type="search" class="ui-control"
                            :placeholder="t('tour.filter.searchPlaceholder')" />
                    </template>
                </UiField>
            </form>

            <!-- Duration Filter -->
            <fieldset class="tour-filter__group">
                <legend class="tour-filter__legend">{{ t('tour.duration') }}</legend>
                <div class="tour-filter__chips">
                    <UiChip v-for="option in durationOptions" :key="option.value"
                        :active="selectedDuration === option.value" @click="toggleDuration(option.value)">
                        {{ option.label }}
                    </UiChip>
                </div>
            </fieldset>

            <!-- Price Range Filter -->
            <fieldset class="tour-filter__group">
                <legend class="tour-filter__legend">
                    {{ t('tour.priceRange') }} ({{ locale === 'vi' ? 'VND' : 'USD' }})
                </legend>
                <label class="tour-filter__range">
                    <span class="tour-filter__range-label">
                        {{ t('tour.from') }} <strong>{{ formatPrice(priceMin) }}</strong>
                    </span>
                    <input v-model.number="priceMin" type="range" min="0" max="2000" step="50" />
                </label>
                <label class="tour-filter__range">
                    <span class="tour-filter__range-label">
                        {{ t('tour.to') }} <strong>{{ formatPrice(priceMax) }}</strong>
                    </span>
                    <input v-model.number="priceMax" type="range" min="0" max="2000" step="50" />
                </label>
            </fieldset>

            <!-- Tour Type Filter -->
            <fieldset class="tour-filter__group">
                <legend class="tour-filter__legend">{{ t('tour.tourType') }}</legend>
                <div class="tour-filter__checks">
                    <label v-for="option in tourTypeOptions" :key="option.value" class="tour-filter__check">
                        <input v-model="selectedTypes" type="checkbox" :value="option.value" />
                        <span>{{ option.label }}</span>
                    </label>
                </div>
            </fieldset>

            <!-- Depart From Filter -->
            <div class="tour-filter__group">
                <UiField :id="`${idPrefix}-depart`" :label="t('tour.departFrom')">
                    <template #default="{ id }">
                        <select :id="id" v-model="selectedDepartFrom" class="ui-control">
                            <option v-for="item in departFromOptions" :key="item.value" :value="item.value">
                                {{ item.label }}
                            </option>
                        </select>
                    </template>
                </UiField>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="tour-filter__actions">
            <UiButton block @click="applyFilters">
                {{ props.showMobile ? t('common.apply') : t('tour.applyFilter') }}
            </UiButton>
            <UiButton variant="ghost" @click="clearFilters">
                {{ props.showMobile ? t('common.clear') : t('tour.clearFilter') }}
            </UiButton>
        </div>
    </div>
</template>

<style scoped>
.tour-filter {
    position: sticky;
    top: calc(var(--header-height) + 1.5rem);
}

.tour-filter__head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    padding-bottom: var(--space-4);
    border-bottom: 1px solid var(--color-border-strong);
}

.tour-filter__title {
    font-family: var(--font-serif);
    font-size: var(--text-3xl);
}

.tour-filter__count {
    min-width: 1.5rem;
    padding: 0.125rem var(--space-2);
    border-radius: var(--radius-pill);
    background: var(--color-accent);
    color: var(--color-on-accent);
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    text-align: center;
}

.tour-filter__group {
    min-width: 0;
    margin: 0;
    padding: var(--space-5) 0;
    border: 0;
    border-bottom: 1px solid var(--color-border);
}

/* float để legend nằm trong khung như nhãn thường, không đè lên đường kẻ */
.tour-filter__legend {
    float: left;
    width: 100%;
    margin-bottom: var(--space-3);
    padding: 0;
    color: var(--color-text-muted);
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
}

.tour-filter__legend + * {
    clear: both;
}

.tour-filter__chips {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
}

.tour-filter__range {
    display: grid;
    gap: 0.375rem;
}

.tour-filter__range + .tour-filter__range {
    margin-top: var(--space-4);
}

.tour-filter__range-label {
    color: var(--color-text-muted);
    font-size: var(--text-md);
}

.tour-filter__range-label strong {
    color: var(--color-text);
    font-weight: var(--weight-medium);
}

.tour-filter__range input,
.tour-filter__check input {
    accent-color: var(--color-accent);
}

.tour-filter__range input {
    width: 100%;
}

.tour-filter__checks {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 8rem), 1fr));
    gap: var(--space-2) var(--space-4);
}

.tour-filter__check {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    min-height: 2.25rem;
    font-size: var(--text-ui);
    cursor: pointer;
}

.tour-filter__check input {
    width: 1.125rem;
    height: 1.125rem;
}

.tour-filter__actions {
    display: grid;
    justify-items: center;
    gap: var(--space-2);
    padding-top: var(--space-5);
}

/* Dạng bottom sheet trên mobile: phần thân cuộn, nút cố định ở dưới */
.tour-filter--sheet {
    position: static;
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
}

.tour-filter--sheet .tour-filter__body {
    flex: 1;
    overflow-y: auto;
    padding-inline: var(--gutter);
}

.tour-filter--sheet .tour-filter__actions {
    padding: var(--space-4) var(--gutter);
    border-top: 1px solid var(--color-border);
}
</style>
