<script setup lang="ts">
// In nghiêng (màu nhấn) cụm từ `match` bên trong chuỗi dịch mà không phải tách key i18n.
const props = defineProps<{
    text: string;
    match?: string;
}>();

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const parts = computed(() => {
    if (!props.match) {
        return [{ text: props.text, em: false }];
    }
    return props.text
        .split(new RegExp(`(${escapeRegExp(props.match)})`))
        .filter(Boolean)
        .map((part) => ({ text: part, em: part === props.match }));
});
</script>

<template>
    <template v-for="(part, i) in parts" :key="i">
        <em v-if="part.em" class="ui-em">{{ part.text }}</em><template v-else>{{ part.text }}</template>
    </template>
</template>

<style scoped>
.ui-em {
    color: var(--em-color, var(--color-accent));
    font-style: italic;
}
</style>
