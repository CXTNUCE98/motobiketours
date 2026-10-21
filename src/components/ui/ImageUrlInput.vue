<script setup lang="ts">
// Ô dán URL ảnh, dùng song song với nút tải ảnh lên. Chỉ phát `submit` khi URL đã tải thử thành ảnh.
import { Close } from '@element-plus/icons-vue';
import { normalizeImageUrl, probeImage } from '~/utils/imageUrl';

const props = defineProps<{
    placeholder?: string;
    disabled?: boolean;
    autofocus?: boolean;
    /** Hiện nút X để bỏ ô này (phát `remove`) */
    removable?: boolean;
}>();

const emit = defineEmits<{ submit: [url: string]; remove: [] }>();

const { t } = useI18n();
const value = ref('');
const error = ref('');
const checking = ref(false);
const input = ref<HTMLInputElement | null>(null);
const errorId = useId();

onMounted(() => {
    if (props.autofocus) input.value?.focus();
});

const submit = async () => {
    if (checking.value || props.disabled) return;
    const raw = value.value.trim();
    if (!raw) return;

    const url = normalizeImageUrl(raw);
    if (!url) {
        error.value = t('common.imageUrl.invalid');
        return;
    }

    error.value = '';
    checking.value = true;
    try {
        await probeImage(url);
        value.value = '';
        emit('submit', url);
    } catch {
        error.value = t('common.imageUrl.loadFailed');
    } finally {
        checking.value = false;
    }
};
</script>

<template>
    <div class="ui-image-url">
        <div class="ui-image-url__row">
            <input ref="input" v-model="value" type="text" inputmode="url" autocomplete="off" spellcheck="false"
                class="ui-control ui-image-url__input" :aria-label="t('common.imageUrl.label')"
                :placeholder="placeholder ?? t('common.imageUrl.placeholder')" :disabled="disabled"
                :readonly="checking" :aria-invalid="error ? 'true' : undefined"
                :aria-describedby="error ? errorId : undefined" @input="error = ''"
                @keydown.enter.prevent="submit">
            <UiButton variant="outline" size="sm" :disabled="disabled || checking || !value.trim()" @click="submit">
                {{ checking ? t('common.imageUrl.checking') : t('common.imageUrl.use') }}
            </UiButton>
            <button v-if="removable" type="button" class="ui-image-url__remove"
                :aria-label="t('common.imageUrl.removeField')" @click="emit('remove')">
                <el-icon>
                    <Close />
                </el-icon>
            </button>
        </div>
        <p v-if="error" :id="errorId" class="ui-image-url__error" role="alert">{{ error }}</p>
    </div>
</template>

<style scoped>
.ui-image-url {
    width: 100%;
}

.ui-image-url__row {
    display: flex;
    align-items: center;
    gap: var(--space-2);
}

.ui-image-url__input {
    flex: 1;
    min-width: 0;
    min-height: 2.5rem;
    padding-block: var(--space-2);
    font-size: var(--text-sm);
}

.ui-image-url__remove {
    display: grid;
    flex-shrink: 0;
    place-items: center;
    width: 2.5rem;
    height: 2.5rem;
    border: 0;
    border-radius: var(--radius-pill);
    background: transparent;
    color: var(--color-text-muted);
    cursor: pointer;
    transition: background-color var(--transition-base), color var(--transition-base);
}

.ui-image-url__remove:hover {
    background: var(--color-bg-subtle);
    color: var(--color-text);
}

.ui-image-url__error {
    margin-top: 0.375rem;
    color: var(--color-danger);
    font-size: var(--text-sm);
    line-height: var(--leading-snug);
}
</style>
