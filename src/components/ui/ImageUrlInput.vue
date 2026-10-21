<script setup lang="ts">
// Ô dán URL ảnh, dùng song song với nút tải ảnh lên. Chỉ phát `submit` với các URL đã tải thử thành công.
import { normalizeImageUrl, probeImage, splitUrls } from '~/utils/imageUrl';

const props = defineProps<{
    /** Cho dán nhiều URL một lần, cách nhau bởi dấu cách hoặc xuống dòng */
    multiple?: boolean;
    placeholder?: string;
    disabled?: boolean;
}>();

const emit = defineEmits<{ submit: [urls: string[]] }>();

const { t } = useI18n();
const value = ref('');
const error = ref('');
const checking = ref(false);
const errorId = useId();

// Ô một dòng tự bỏ ký tự xuống dòng khi dán, làm các URL dính vào nhau
const onPaste = (event: ClipboardEvent) => {
    const text = event.clipboardData?.getData('text') ?? '';
    if (!props.multiple || !/\s/.test(text.trim())) return;
    event.preventDefault();
    value.value = `${value.value} ${splitUrls(text).join(' ')}`.trim();
};

const submit = async () => {
    if (checking.value || props.disabled) return;
    const raw = props.multiple ? splitUrls(value.value) : [value.value.trim()].filter(Boolean);
    if (!raw.length) return;

    const malformed = raw.find((item) => !normalizeImageUrl(item));
    if (malformed) {
        error.value = t('common.imageUrl.invalid', { url: malformed });
        return;
    }

    const urls = raw.map((item) => normalizeImageUrl(item)!);
    error.value = '';
    checking.value = true;
    const results = await Promise.allSettled(urls.map((url) => probeImage(url)));
    checking.value = false;

    const loaded = urls.filter((_, index) => results[index]?.status === 'fulfilled');
    const failed = raw.filter((_, index) => results[index]?.status === 'rejected');
    if (loaded.length) emit('submit', loaded);

    // Giữ lại các URL lỗi trong ô để người dùng sửa
    value.value = failed.join(' ');
    if (failed.length) {
        error.value = failed.length === 1
            ? t('common.imageUrl.loadFailed')
            : t('common.imageUrl.loadFailedMany', { count: failed.length });
    }
};
</script>

<template>
    <div class="ui-image-url">
        <div class="ui-image-url__row">
            <input v-model="value" type="text" inputmode="url" autocomplete="off" spellcheck="false"
                class="ui-control ui-image-url__input" :aria-label="t('common.imageUrl.label')"
                :placeholder="placeholder ?? t('common.imageUrl.placeholder')" :disabled="disabled"
                :readonly="checking" :aria-invalid="error ? 'true' : undefined"
                :aria-describedby="error ? errorId : undefined" @input="error = ''" @paste="onPaste"
                @keydown.enter.prevent="submit">
            <UiButton variant="outline" size="sm" :disabled="disabled || checking || !value.trim()" @click="submit">
                {{ checking ? t('common.imageUrl.checking') : t('common.imageUrl.use') }}
            </UiButton>
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

.ui-image-url__error {
    margin-top: 0.375rem;
    color: var(--color-danger);
    font-size: var(--text-sm);
    line-height: var(--leading-snug);
}
</style>
