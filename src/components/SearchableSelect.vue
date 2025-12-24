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

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
    <div class="relative w-full" ref="selectRef">
        <!-- Input Display -->
        <div class="relative cursor-pointer" @click="toggleDropdown">
            <i v-if="icon" :class="[icon, 'absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400 z-10']"></i>
            <input type="text" :value="isOpen ? searchQuery : displayedValue"
                @input="searchQuery = ($event.target as HTMLInputElement).value" :placeholder="placeholder" readonly
                class="w-full pl-12 pr-10 py-3.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:bg-white dark:focus:bg-gray-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 cursor-pointer"
                :class="{
                    'ring-4 ring-indigo-500/10 border-indigo-500 bg-white dark:bg-gray-600': isOpen,
                    'border-red-500 focus:border-red-500 focus:ring-red-500/10': hasError
                }" @mousedown.prevent />
            <!-- Custom Arrow -->
            <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300"
                :class="{ 'rotate-180': isOpen }">
                <i class="bx bx-chevron-down text-xl text-gray-400"></i>
            </div>

            <!-- Loading Spinner -->
            <div v-if="loading" class="absolute right-10 top-1/2 -translate-y-1/2">
                <i class="bx bx-loader-alt animate-spin text-indigo-500"></i>
            </div>
        </div>

        <!-- Dropdown Panel -->
        <transition enter-active-class="transition duration-200 ease-out"
            enter-from-class="transform scale-95 opacity-0 -translate-y-2"
            enter-to-class="transform scale-100 opacity-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="transform scale-100 opacity-100 translate-y-0"
            leave-to-class="transform scale-95 opacity-0 -translate-y-2">
            <div v-if="isOpen"
                class="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl bg-opacity-95 dark:bg-opacity-95">

                <!-- Search box for mobile or accessibility if needed, currently reusing main input -->
                <div v-if="isOpen" class="p-2 border-b border-gray-100 dark:border-gray-700">
                    <div class="relative">
                        <i class="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        <input v-model="searchQuery" type="text"
                            class="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-700/50 border-none outline-none rounded-lg focus:ring-0 text-sm dark:text-white"
                            placeholder="Gõ để tìm kiếm..." @click.stop />
                    </div>
                </div>

                <ul
                    class="max-h-60 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-600">
                    <li v-for="option in filteredOptions" :key="option.value" @click="selectOption(option)"
                        class="px-4 py-2.5 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 cursor-pointer transition-colors flex items-center justify-between group"
                        :class="{ 'bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400': modelValue === option.value }">
                        <span
                            class="text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {{ option.label }}
                        </span>
                        <i v-if="modelValue === option.value" class="bx bx-check text-lg"></i>
                    </li>
                    <li v-if="filteredOptions.length === 0" class="px-4 py-8 text-center text-gray-400 text-sm">
                        {{ $t('contact.notFound') }}
                    </li>
                </ul>
            </div>
        </transition>
    </div>
</template>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
    width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
    @apply bg-gray-200 dark:bg-gray-700 rounded-full;
}
</style>
