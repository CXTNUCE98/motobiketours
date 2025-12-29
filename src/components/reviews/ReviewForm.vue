<script setup lang="ts">

const props = defineProps<{
    tourId: string;
}>();

const emit = defineEmits(['success']);
const { t } = useI18n();
const { isAuthenticated } = useAuth();

const form = ref({
    rating: 5,
    content: '',
    images: [] as string[]
});

const fileList = ref<any[]>([]);
const isSubmitting = ref(false);

const { mutateAsync: uploadImage } = useUploadImageMutation();
const createReviewMutation = useCreateReviewMutation(props.tourId);

const handleFileUpload = async (file: any) => {
    try {
        const response = await uploadImage(file.file);
        form.value.images.push(response.url);
        ElMessage.success(t('review.imageUploadSuccess') || 'Image uploaded successfully');
    } catch (err) {
        ElMessage.error(t('review.imageUploadError') || 'Failed to upload image');
    }
};

const handleRemoveImage = (file: any) => {
    const url = file.response?.url || file.url;
    form.value.images = form.value.images.filter(img => img !== url);
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
    <div
        class="review-form bg-white dark:bg-zinc-900/50 p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm relative overflow-hidden">

        <h3 class="text-2xl font-black mb-8 text-gray-900 dark:text-zinc-100 flex items-center gap-3">
            <el-icon class="text-blue-600">
                <EditPen />
            </el-icon>
            {{ t('review.write') }}
        </h3>

        <div v-if="!isAuthenticated"
            class="text-center py-10 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-zinc-700">
            <el-icon size="48" class="text-gray-300 dark:text-zinc-600 mb-4">
                <Lock />
            </el-icon>
            <p class="text-gray-500 dark:text-zinc-400 mb-6 font-medium">{{ t('review.loginRequired') }}</p>
            <el-button type="primary" size="large" class="!rounded-full px-10 shadow-lg shadow-blue-500/30"
                @click="$router.push('/login')">
                {{ t('auth.signIn') }}
            </el-button>
        </div>

        <el-form v-else label-position="top" class="custom-form">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <el-form-item :label="t('review.rating')" class="rating-item">
                    <div
                        class="flex items-center gap-4 bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-gray-100 dark:border-zinc-700">
                        <el-rate v-model="form.rating" size="large" show-score score-template="{value} / 5" />
                    </div>
                </el-form-item>
            </div>

            <el-form-item :label="t('review.content')">
                <el-input v-model="form.content" type="textarea" :rows="5" :placeholder="t('review.placeholder')"
                    class="custom-textarea" />
            </el-form-item>

            <el-form-item :label="t('review.images')">
                <el-upload v-model:file-list="fileList" list-type="picture-card" :http-request="handleFileUpload"
                    :on-remove="handleRemoveImage" class="custom-upload">
                    <div class="flex flex-col items-center">
                        <el-icon class="mb-1">
                            <Plus />
                        </el-icon>
                        <span class="text-xs">{{ t('common.upload') }}</span>
                    </div>
                </el-upload>
            </el-form-item>

            <div class="flex justify-end mt-8">
                <el-button type="primary" :loading="isSubmitting" size="large"
                    class="submit-btn !rounded-full px-12 h-14 text-base font-bold shadow-xl shadow-blue-600/20"
                    @click="handleSubmit">
                    {{ t('review.submit') }}
                </el-button>
            </div>
        </el-form>
    </div>
</template>

<style scoped>
.custom-textarea :deep(.el-textarea__inner) {
    @apply rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border-gray-100 dark:border-zinc-700 focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-800 transition-all p-4 text-base;
}

.custom-upload :deep(.el-upload--picture-card) {
    @apply rounded-2xl border-2 border-dashed border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 hover:border-blue-500 hover:text-blue-500 transition-all w-24 h-24;
}

.custom-upload :deep(.el-upload-list__item) {
    @apply rounded-2xl border-0 shadow-sm w-24 h-24;
}

.submit-btn {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    border: none;
}

.submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 20px -5px rgba(37, 99, 235, 0.4);
}

:deep(.el-form-item__label) {
    @apply text-sm font-bold text-gray-700 dark:text-zinc-300 mb-2 pl-1;
}

.rating-item :deep(.el-rate__text) {
    @apply font-black text-blue-600 ml-2 text-lg;
}
</style>
