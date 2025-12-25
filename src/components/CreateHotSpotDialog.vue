<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus, Delete, Upload } from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus';
import type { HotSpot } from '~/types/api';

const props = defineProps<{
    modelValue: boolean;
    spotData?: HotSpot | null;
}>();

const emit = defineEmits(['update:modelValue', 'success']);

const { t } = useI18n();
const { mutateAsync: createHotSpot, isPending: isCreating } = useCreateHotSpot();
const { mutateAsync: updateHotSpot, isPending: isUpdating } = useUpdateHotSpot();
const { mutateAsync: uploadImage } = useUploadImageMutation();

const dialogVisible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
});

const isEditMode = computed(() => !!props.spotData);
const formRef = ref<FormInstance>();

const formData = reactive({
    name: '',
    description: '',
    category: '',
    rating: 5,
    address: '',
    lat: 0,
    lng: 0,
    images: [] as string[],
    opening_hours: '',
    price_info: '',
    is_hot: false,
});

const rules = reactive<FormRules>({
    name: [
        { required: true, message: 'Please input name', trigger: 'blur' },
        { min: 3, message: 'Length should be at least 3', trigger: 'blur' },
    ],
    category: [
        { required: true, message: 'Please select category', trigger: 'change' },
    ],
    address: [
        { required: true, message: 'Please input address', trigger: 'blur' },
    ],
    lat: [
        { required: true, message: 'Please input latitude', trigger: 'blur' },
    ],
    lng: [
        { required: true, message: 'Please input longitude', trigger: 'blur' },
    ],
});

watch(() => props.spotData, (newData) => {
    if (newData) {
        Object.assign(formData, {
            name: newData.name,
            description: newData.description,
            category: newData.category,
            rating: newData.rating,
            address: newData.address,
            lat: newData.lat,
            lng: newData.lng,
            images: newData.images || [],
            opening_hours: newData.opening_hours,
            price_info: newData.price_info,
            is_hot: newData.is_hot,
        });
    } else {
        resetForm();
    }
});

const resetForm = () => {
    if (formRef.value) formRef.value.resetFields();
    Object.assign(formData, {
        name: '',
        description: '',
        category: '',
        rating: 5,
        address: '',
        lat: 0,
        lng: 0,
        images: [],
        opening_hours: '',
        price_info: '',
        is_hot: false,
    });
};

const categories = [
    { label: 'Check-in', value: 'Check-in' },
    { label: 'Cảnh đẹp', value: 'Cảnh đẹp' },
    { label: 'Vãn cảnh', value: 'Vãn cảnh' },
    { label: 'Ẩm thực', value: 'Ẩm thực' },
];

const isUploading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const handleImageUpload = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    isUploading.value = true;
    try {
        for (const file of Array.from(input.files)) {
            const res = await uploadImage(file);
            formData.images.push(res.url);
        }
    } catch (error) {
        ElMessage.error('Upload failed');
    } finally {
        isUploading.value = false;
        if (fileInput.value) fileInput.value.value = '';
    }
};

const removeImage = (index: number) => {
    formData.images.splice(index, 1);
};

const handleSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            try {
                if (isEditMode.value && props.spotData) {
                    await updateHotSpot({ id: props.spotData.id, data: formData });
                } else {
                    await createHotSpot(formData);
                }
                emit('success');
                handleClose();
            } catch (error) {
                console.log(error);
            }
        }
    });
};

const handleClose = () => {
    dialogVisible.value = false;
    resetForm();
};
</script>

<template>
    <el-dialog v-model="dialogVisible"
        :title="isEditMode ? `${t('hotSpots.update')} ${formData.name}` : t('hotSpots.create')" width="90%"
        class="max-w-2xl [&_.el-dialog\_\_title]:font-bold rounded-2xl overflow-hidden [&_.el-dialog\_\_title]:dark:text-white detail-dialog dark:bg-gray-800"
        :before-close="handleClose" :lock-scroll="true" :align-center="true">
        <el-scrollbar height="80vh">
            <div class="overflow-y-auto p-4">
                <el-form ref="formRef" :model="formData" :rules="rules" label-position="top">
                    <el-form-item class="[&_.el-form-item\_\_label]:dark:text-white" :label="t('common.name')"
                        prop="name">
                        <el-input
                            class="[&_.el-input\_\_wrapper]:dark:bg-gray-800 [&_.el-input\_\_inner]:dark:text-white"
                            v-model="formData.name" placeholder="Spot name..." size="large" />
                    </el-form-item>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <el-form-item class="[&_.el-form-item\_\_label]:dark:text-white" :label="t('common.category')"
                            prop="category">
                            <el-select
                                class="w-full [&_.el-select\_\_wrapper]:dark:bg-gray-800 [&_.el-select\_\_selected-item]:dark:text-white"
                                v-model="formData.category" :placeholder="t('common.selectCategory')" size="large">
                                <el-option v-for="cat in categories" :key="cat.value" :label="cat.label"
                                    :value="cat.value" />
                            </el-select>
                        </el-form-item>

                        <el-form-item class="[&_.el-form-item\_\_label]:dark:text-white" :label="t('common.rating')"
                            prop="rating">
                            <div class="flex items-center gap-2 w-full">
                                <el-rate v-model="formData.rating" allow-half />
                                <span class="text-sm text-gray-500">{{ formData.rating }}</span>
                            </div>
                        </el-form-item>
                    </div>

                    <el-form-item class="[&_.el-form-item\_\_label]:dark:text-white" :label="t('common.address')"
                        prop="address">
                        <el-input v-model="formData.address"
                            class="[&_.el-input\_\_wrapper]:dark:bg-gray-800 [&_.el-input\_\_inner]:dark:text-white"
                            placeholder="Full address..." size="large" />
                    </el-form-item>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <el-form-item class="[&_.el-form-item\_\_label]:dark:text-white" :label="t('common.latitude')"
                            prop="lat">
                            <el-input-number v-model="formData.lat" :precision="6" :step="0.0001"
                                class="w-full [&_.el-input\_\_wrapper]:dark:bg-gray-800 [&_.el-input-number\_\_decrease]:(dark:bg-gray-800 dark:text-white) [&_.el-input-number\_\_increase]:(dark:bg-gray-800 dark:text-white) [&_.el-input\_\_inner]:dark:text-white"
                                size="large" />
                        </el-form-item>
                        <el-form-item class="[&_.el-form-item\_\_label]:dark:text-white" :label="t('common.longitude')"
                            prop="lng">
                            <el-input-number v-model="formData.lng" :precision="6" :step="0.0001"
                                class="w-full [&_.el-input\_\_wrapper]:dark:bg-gray-800 [&_.el-input-number\_\_decrease]:(dark:bg-gray-800 dark:text-white) [&_.el-input-number\_\_increase]:(dark:bg-gray-800 dark:text-white) [&_.el-input\_\_inner]:dark:text-white"
                                size="large" />
                        </el-form-item>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <el-form-item class="[&_.el-form-item\_\_label]:dark:text-white"
                            :label="t('common.openingHours')" prop="opening_hours">
                            <el-input v-model="formData.opening_hours"
                                class="[&_.el-input\_\_wrapper]:dark:bg-gray-800 [&_.el-input\_\_inner]:dark:text-white"
                                placeholder="e.g. 08:00 - 22:00" size="large" />
                        </el-form-item>
                        <el-form-item class="[&_.el-form-item\_\_label]:dark:text-white" :label="t('common.priceInfo')"
                            prop="price_info">
                            <el-input v-model="formData.price_info"
                                class="[&_.el-input\_\_wrapper]:dark:bg-gray-800 [&_.el-input\_\_inner]:dark:text-white"
                                placeholder="e.g. Free or 50.000đ" size="large" />
                        </el-form-item>
                    </div>

                    <el-form-item class="[&_.el-form-item\_\_label]:dark:text-white" :label="t('common.description')"
                        prop="description">
                        <el-input v-model="formData.description"
                            class="[&_.el-textarea\_\_inner]:dark:bg-gray-800 [&_.el-textarea\_\_inner]:dark:text-white"
                            type="textarea" :rows="3" placeholder="Describe the spot..." />
                    </el-form-item>

                    <el-form-item class="[&_.el-form-item\_\_label]:dark:text-white" :label="t('common.images')"
                        prop="images">
                        <div class="grid grid-cols-4 gap-3 w-full">
                            <div v-for="(img, idx) in formData.images" :key="idx"
                                class="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                                <img :src="img" class="w-full h-full object-cover" />
                                <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                                    @click="removeImage(idx)">
                                    <el-icon class="text-white text-xl">
                                        <Delete />
                                    </el-icon>
                                </div>
                            </div>
                            <div class="aspect-square flex items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg cursor-pointer hover:border-blue-500 transition-colors bg-zinc-50 dark:bg-zinc-800/50"
                                @click="fileInput?.click()">
                                <el-icon v-if="!isUploading" class="text-2xl text-gray-400">
                                    <Plus />
                                </el-icon>
                                <el-icon v-else class="text-2xl text-blue-500 is-loading">
                                    <Upload />
                                </el-icon>
                            </div>
                        </div>
                        <input ref="fileInput" type="file" multiple accept="image/*" class="hidden"
                            @change="handleImageUpload" />
                    </el-form-item>

                    <el-form-item>
                        <el-checkbox v-model="formData.is_hot" label="Mark as Hot Spot" size="large" border />
                    </el-form-item>
                </el-form>
            </div>
        </el-scrollbar>
        <template #footer>
            <div class="flex justify-end gap-3">
                <el-button @click="handleClose">{{ t('common.cancel') }}</el-button>
                <el-button type="primary" @click="handleSubmit(formRef)" :loading="isCreating || isUpdating">
                    {{ isEditMode ? t('common.update') : t('common.create') }}
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style scoped>
.detail-dialog :deep(.el-dialog__body) {
    padding: 0;
}


/* :deep(.el-dialog) {
    border-radius: 1rem;
    background-color: var(--color-bg-primary);
}

.dark :deep(.el-dialog__title) {
    color: var(--color-text-primary);
}

:deep(.el-dialog__header) {
    margin-right: 0;
    padding: 1.5rem;
    border-bottom: 1px solid var(--color-border);
}

:deep(.el-dialog__body) {
    padding: 0;
    background-color: var(--color-bg-primary);
}

:deep(.el-dialog__footer) {
    padding: 1.5rem;
    border-top: 1px solid var(--color-border);
    background-color: var(--color-bg-primary);
}

:deep(.el-form-item__label) {
    color: var(--color-text-secondary);
    font-weight: 600;
}

.dark :deep(.el-input__wrapper),
.dark :deep(.el-textarea__inner),
.dark :deep(.el-input-number__wrapper) {
    background-color: var(--color-bg-secondary);
    box-shadow: 0 0 0 1px var(--color-border) inset;
}

.dark :deep(.el-input__inner),
.dark :deep(.el-textarea__inner) {
    color: var(--color-text-primary);
}

.dark :deep(.el-checkbox.is-bordered) {
    border-color: var(--color-border);
}

.dark :deep(.el-checkbox__label) {
    color: var(--color-text-primary);
} */
</style>
