<script setup lang="ts">
const props = defineProps<{
    tourId: string;
}>();

const emit = defineEmits(['success']);
const { t } = useI18n();
const { isAuthenticated } = useAuth();
const { openLoginPopup } = useLoginPopup();

const form = ref({
    rating: 5,
    content: '',
    images: [] as string[]
});

const fileList = ref<any[]>([]);
const isSubmitting = ref(false);

const { mutateAsync: uploadImage } = useUploadMutation();
const createReviewMutation = useCreateReviewMutation(props.tourId);

const rateColors = ['var(--color-accent)', 'var(--color-accent)', 'var(--color-accent)'];

// Trả về kết quả để el-upload lưu vào file.response (khi xóa ảnh cần URL thật, không phải blob xem trước);
// ném lỗi lại để el-upload bỏ ô ảnh tải hỏng khỏi danh sách
const handleFileUpload = async (file: any) => {
    try {
        const response = await uploadImage({ file: file.file, folder: 'reviews' });
        form.value.images.push(response.url);
        ElMessage.success(t('review.imageUploadSuccess') || 'Image uploaded successfully');
        return response;
    } catch (err) {
        ElMessage.error(t('review.imageUploadError') || 'Failed to upload image');
        throw err;
    }
};

const handleRemoveImage = (file: any) => {
    const url = file.response?.url || file.url;
    form.value.images = form.value.images.filter(img => img !== url);
};

// Mỗi link một ô nhập; ô tự biến mất khi ảnh của nó đã vào danh sách
const urlRows = ref<number[]>([]);
let nextRowId = 0;

const addUrlRow = () => {
    urlRows.value = [...urlRows.value, nextRowId++];
};

const removeUrlRow = (id: number) => {
    urlRows.value = urlRows.value.filter(rowId => rowId !== id);
};

const addImageUrl = (id: number, url: string) => {
    if (form.value.images.includes(url)) {
        ElMessage.info(t('common.imageUrl.duplicate'));
    } else {
        form.value.images.push(url);
        fileList.value.push({ name: url.split('/').pop() || url, url, status: 'success' });
    }
    removeUrlRow(id);
};

const handleSubmit = async () => {
    if (!isAuthenticated.value) {
        ElMessage.warning(t('review.loginRequired'));
        return;
    }

    if (!form.value.content.trim()) {
        ElMessage.warning(t('review.validation.contentRequired') || 'Content is required');
        return;
    }

    try {
        isSubmitting.value = true;
        await createReviewMutation.mutateAsync({
            tourId: props.tourId,
            rating: form.value.rating,
            content: form.value.content,
            images: form.value.images
        });

        ElMessage.success(t('review.success'));
        form.value = { rating: 5, content: '', images: [] };
        fileList.value = [];
        emit('success');
    } catch (err) {
        ElMessage.error(t('review.error'));
    } finally {
        isSubmitting.value = false;
    }
};
</script>

<template>
    <div class="review-form">
        <h3 class="review-form__title">{{ t('review.write') }}</h3>

        <UiEmptyState v-if="!isAuthenticated" :title="t('review.loginRequired')">
            <UiButton @click="openLoginPopup">{{ t('auth.signIn') }}</UiButton>
        </UiEmptyState>

        <form v-else class="review-form__fields" novalidate @submit.prevent="handleSubmit">
            <div class="review-form__rating">
                <p id="review-rating-label" class="review-form__label">{{ t('review.rating') }}</p>
                <el-rate v-model="form.rating" size="large" show-score score-template="{value} / 5"
                    :colors="rateColors" void-color="var(--color-border)" aria-labelledby="review-rating-label" />
            </div>

            <UiField :label="t('review.content')">
                <template #default="{ id }">
                    <textarea :id="id" v-model="form.content" rows="5" class="ui-control"
                        :placeholder="t('review.placeholder')"></textarea>
                </template>
            </UiField>

            <div class="review-form__images">
                <p class="review-form__label">{{ t('review.images') }}</p>
                <el-upload v-model:file-list="fileList" list-type="picture-card" :http-request="handleFileUpload"
                    :on-remove="handleRemoveImage" class="review-form__upload">
                    <span class="review-form__upload-btn">
                        <span aria-hidden="true">+</span>
                        {{ t('common.upload') }}
                    </span>
                </el-upload>
                <div class="review-form__urls">
                    <UiImageUrlInput v-for="id in urlRows" :key="id" autofocus removable
                        :placeholder="t('common.imageUrl.fieldPlaceholder')"
                        @submit="addImageUrl(id, $event)" @remove="removeUrlRow(id)" />
                    <UiButton variant="ghost" size="sm" class="review-form__add-url" @click="addUrlRow">
                        <span aria-hidden="true">+</span>
                        {{ t('common.imageUrl.add') }}
                    </UiButton>
                </div>
            </div>

            <UiButton type="submit" :disabled="isSubmitting">
                {{ isSubmitting ? t('common.processing') : t('review.submit') }}
            </UiButton>
        </form>
    </div>
</template>

<style scoped>
.review-form__title {
    margin-bottom: var(--space-6);
    font-family: var(--font-serif);
    font-size: var(--text-title-lg);
    font-weight: var(--weight-regular);
}

.review-form__fields {
    display: grid;
    gap: var(--space-6);
    max-width: 36rem;
}

.review-form__label {
    margin-bottom: var(--space-2);
    color: var(--color-text-muted);
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
}

.review-form__upload-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    color: var(--color-text-muted);
    font-size: var(--text-sm);
}

.review-form__urls {
    display: grid;
    justify-items: start;
    gap: var(--space-3);
    margin-top: var(--space-3);
}

.review-form__add-url {
    padding-inline: 0.75rem;
}

:deep(.el-upload--picture-card) {
    width: 5.5rem;
    height: 5.5rem;
    border: 1px dashed var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-bg-subtle);
}

:deep(.el-upload--picture-card:hover) {
    border-color: var(--color-accent);
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
    width: 5.5rem;
    height: 5.5rem;
    border-radius: var(--radius-md);
}

:deep(.el-rate) {
    --el-rate-icon-size: 22px;
    height: auto;
}
</style>
