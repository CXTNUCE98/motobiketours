<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Option {
    value: string
    label: string
}

const props = defineProps<{
    modelValue: string
    options: Option[]
    placeholder?: string
    loading?: boolean
    icon?: string
    hasError?: boolean
    inputId?: string
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
    (e: 'blur'): void
}>()

const isOpen = ref(false)
const searchQuery = ref('')
const selectRef = ref<HTMLElement | null>(null)

const filteredOptions = computed(() => {
    if (!searchQuery.value) return props.options
    const query = searchQuery.value.toLowerCase()
    return props.options.filter(opt =>
        opt.label.toLowerCase().includes(query)
    )
})

const displayedValue = computed(() => {
    if (isOpen.value) return searchQuery.value
    const selected = props.options.find(opt => opt.value === props.modelValue)
    return selected ? selected.label : ''
})

const toggleDropdown = () => {
    isOpen.value = !isOpen.value
    if (isOpen.value) {
        searchQuery.value = ''
    }
}

const selectOption = (option: Option) => {
    emit('update:modelValue', option.value)
    isOpen.value = false
    searchQuery.value = ''
}

const handleClickOutside = (event: MouseEvent) => {
    if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
        if (isOpen.value) {
            isOpen.value = false
            emit('blur')
        }
    }
}

// Trạng thái tải chỉ hiện sau khi mount: server và client có thể khác nhau về `loading`
const isMounted = ref(false)

onMounted(() => {
    isMounted.value = true
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
    <div class="searchable-select" ref="selectRef">
        <!-- Input Display -->
        <div class="searchable-select__trigger" @click="toggleDropdown">
            <i v-if="icon" :class="[icon, 'searchable-select__icon']" aria-hidden="true"></i>
            <input :id="inputId" type="text" :value="isOpen ? searchQuery : displayedValue"
                @input="searchQuery = ($event.target as HTMLInputElement).value" :placeholder="placeholder" readonly
                class="ui-control searchable-select__input"
                :class="{ 'has-icon': icon, 'is-open': isOpen }"
                :aria-invalid="hasError ? 'true' : undefined" aria-haspopup="listbox" :aria-expanded="isOpen"
                @mousedown.prevent @keydown.enter.prevent="toggleDropdown" @keydown.space.prevent="toggleDropdown" />
            <!-- Custom Arrow -->
            <span class="searchable-select__arrow" :class="{ 'is-open': isOpen }" aria-hidden="true"></span>

            <!-- Loading Spinner -->
            <span v-if="loading && isMounted" class="searchable-select__loading" aria-hidden="true">
                <i class="bx bx-loader-alt animate-spin"></i>
            </span>
        </div>

        <!-- Dropdown Panel -->
        <transition name="searchable-select">
            <div v-if="isOpen" class="searchable-select__panel">
                <div class="searchable-select__search">
                    <input v-model="searchQuery" type="search" class="ui-control"
                        :placeholder="$t('common.searchPlaceholder')" @click.stop />
                </div>

                <ul class="searchable-select__options" role="listbox">
                    <li v-for="option in filteredOptions" :key="option.value" role="option"
                        :aria-selected="modelValue === option.value" @click="selectOption(option)">
                        {{ option.label }}
                    </li>
                    <li v-if="filteredOptions.length === 0" class="searchable-select__empty">
                        {{ $t('contact.notFound') }}
                    </li>
                </ul>
            </div>
        </transition>
    </div>
</template>

<style scoped>
.searchable-select {
    position: relative;
    width: 100%;
}

.searchable-select__trigger {
    position: relative;
    cursor: pointer;
}

.searchable-select__input {
    padding-right: 2.75rem;
    cursor: pointer;
}

.searchable-select__input.has-icon {
    padding-left: 2.75rem;
}

.searchable-select__input.is-open {
    border-color: var(--color-accent);
}

.searchable-select__icon {
    position: absolute;
    top: 50%;
    left: 1rem;
    z-index: 1;
    color: var(--color-text-muted);
    font-size: var(--text-lg);
    transform: translateY(-50%);
}

/* Mũi tên vẽ bằng viền, đồng bộ với select.ui-control */
.searchable-select__arrow {
    position: absolute;
    top: 50%;
    right: 1.125rem;
    width: 0.45rem;
    height: 0.45rem;
    border-right: 1.5px solid var(--color-text-muted);
    border-bottom: 1.5px solid var(--color-text-muted);
    transform: translateY(-70%) rotate(45deg);
    transition: transform var(--transition-base);
    pointer-events: none;
}

.searchable-select__arrow.is-open {
    transform: translateY(-30%) rotate(-135deg);
}

.searchable-select__loading {
    position: absolute;
    top: 50%;
    right: 2.5rem;
    color: var(--color-accent);
    transform: translateY(-50%);
}

.searchable-select__panel {
    position: absolute;
    z-index: 50;
    width: 100%;
    margin-top: var(--space-2);
    overflow: hidden;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    background: var(--color-surface);
    box-shadow: var(--shadow-popover);
}

.searchable-select__search {
    padding: var(--space-2);
    border-bottom: 1px solid var(--color-border);
}

.searchable-select__search .ui-control {
    min-height: 2.5rem;
    padding-block: var(--space-2);
    font-size: var(--text-ui);
}

.searchable-select__options {
    max-height: 15rem;
    overflow-y: auto;
    padding-block: var(--space-1);
}

.searchable-select__options li[role='option'] {
    padding: 0.625rem var(--space-4);
    color: var(--color-text);
    cursor: pointer;
    transition: background-color var(--transition-fast);
}

.searchable-select__options li[role='option']:hover {
    background: var(--color-bg-subtle);
}

.searchable-select__options li[aria-selected='true'] {
    color: var(--color-accent);
    font-weight: var(--weight-medium);
}

.searchable-select__empty {
    padding: var(--space-8) var(--space-4);
    color: var(--color-text-muted);
    font-size: var(--text-md);
    text-align: center;
}

.searchable-select-enter-active,
.searchable-select-leave-active {
    transition: opacity var(--transition-fast), transform var(--transition-fast);
}

.searchable-select-enter-from,
.searchable-select-leave-to {
    opacity: 0;
    transform: translateY(-0.25rem);
}
</style>
