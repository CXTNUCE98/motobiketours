<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
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
const { mutateAsync: uploadImage } = useUploadMutation();

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
    openingHours: '',
    priceInfo: '',
    isHot: false,
});

// Computed để thông báo lỗi và nhãn danh mục cập nhật theo ngôn ngữ đang chọn.
const rules = computed<FormRules>(() => ({
    name: [
        { required: true, message: t('hotSpots.validation.name'), trigger: 'blur' },
        { min: 3, message: t('hotSpots.validation.nameLength'), trigger: 'blur' },
    ],
    category: [
        { required: true, message: t('hotSpots.validation.category'), trigger: 'change' },
    ],
    address: [
        { required: true, message: t('hotSpots.validation.address'), trigger: 'blur' },
    ],
    lat: [
        { required: true, message: t('hotSpots.validation.lat'), trigger: 'blur' },
    ],
    lng: [
        { required: true, message: t('hotSpots.validation.lng'), trigger: 'blur' },
    ],
}));

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
            openingHours: newData.openingHours,
            priceInfo: newData.priceInfo,
            isHot: newData.isHot,
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
        openingHours: '',
        priceInfo: '',
        isHot: false,
    });
};

// Nhãn hiển thị dịch theo ngôn ngữ, giá trị gửi lên API giữ nguyên.
const categories = computed(() => [
    { label: t('hotSpots.categories.checkin'), value: 'Check-in' },
    { label: t('hotSpots.categories.nature'), value: 'Cảnh đẹp' },
    { label: t('hotSpots.categories.spiritual'), value: 'Vãn cảnh' },
    { label: t('hotSpots.categories.food'), value: 'Ẩm thực' },
]);

const isUploading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const handleImageUpload = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    isUploading.value = true;
    try {
        for (const file of Array.from(input.files)) {
            const res = await uploadImage({ file, folder: 'hotspots' });
            formData.images.push(res.url);
        }
    } catch (error) {
        ElMessage.error(t('common.uploadFailed'));
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
    await formEl.validate(async (valid: boolean, fields: any) => {
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
        class="hotspot-dialog" :before-close="handleClose" :lock-scroll="true" :align-center="true">
        <el-scrollbar height="80vh">
            <div class="hotspot-form-wrap">
                <el-form ref="formRef" :model="formData" :rules="rules" label-position="top">
                    <el-form-item :label="t('common.name')" prop="name">
                        <el-input v-model="formData.name" :placeholder="t('hotSpots.namePlaceholder')" size="large" />
                    </el-form-item>

                    <div class="hotspot-form__row">
                        <el-form-item :label="t('common.category')" prop="category">
                            <el-select v-model="formData.category" :placeholder="t('common.selectCategory')"
                                size="large" class="hotspot-form__full">
                                <el-option v-for="cat in categories" :key="cat.value" :label="cat.label"
                                    :value="cat.value" />
                            </el-select>
                        </el-form-item>

                        <el-form-item :label="t('common.rating')" prop="rating">
                            <div class="hotspot-form__rating">
                                <el-rate v-model="formData.rating" allow-half />
                                <span>{{ formData.rating }}</span>
                            </div>
                        </el-form-item>
                    </div>

                    <el-form-item :label="t('common.address')" prop="address">
                        <el-input v-model="formData.address" :placeholder="t('hotSpots.addressPlaceholder')"
                            size="large" />
                    </el-form-item>

                    <div class="hotspot-form__row">
                        <el-form-item :label="t('common.latitude')" prop="lat">
                            <el-input-number v-model="formData.lat" :precision="6" :step="0.0001"
                                class="hotspot-form__full" size="large" />
                        </el-form-item>
                        <el-form-item :label="t('common.longitude')" prop="lng">
                            <el-input-number v-model="formData.lng" :precision="6" :step="0.0001"
                                class="hotspot-form__full" size="large" />
                        </el-form-item>
                    </div>

                    <div class="hotspot-form__row">
                        <el-form-item :label="t('common.openingHours')" prop="openingHours">
                            <el-input v-model="formData.openingHours" :placeholder="t('hotSpots.openingHoursPlaceholder')"
                                size="large" />
                        </el-form-item>
                        <el-form-item :label="t('common.priceInfo')" prop="priceInfo">
                            <el-input v-model="formData.priceInfo" :placeholder="t('hotSpots.priceInfoPlaceholder')"
                                size="large" />
                        </el-form-item>
                    </div>

                    <el-form-item :label="t('common.description')" prop="description">
                        <el-input v-model="formData.description" type="textarea" :rows="3"
                            :placeholder="t('hotSpots.descriptionPlaceholder')" />
                    </el-form-item>

                    <el-form-item :label="t('common.images')" prop="images">
                        <div class="hotspot-images">
                            <div v-for="(img, idx) in formData.images" :key="idx" class="hotspot-images__item">
                                <img :src="img" alt="">
                                <button type="button" class="hotspot-images__remove" :aria-label="t('common.remove')"
                                    @click="removeImage(idx)">
                                    <el-icon>
                                        <Delete />
                                    </el-icon>
                                </button>
                            </div>
                            <button type="button" class="hotspot-images__add" @click="fileInput?.click()">
                                <el-icon v-if="!isUploading">
                                    <Plus />
                                </el-icon>
                                <el-icon v-else class="is-loading">
                                    <Upload />
                                </el-icon>
                            </button>
                        </div>
                        <input ref="fileInput" type="file" multiple accept="image/*" class="visually-hidden"
                            @change="handleImageUpload">
                    </el-form-item>

                    <el-form-item>
                        <el-checkbox v-model="formData.isHot" :label="t('hotSpots.markAsHot')" size="large" border />
                    </el-form-item>
                </el-form>
            </div>
        </el-scrollbar>
        <template #footer>
            <div class="hotspot-dialog__actions">
                <UiButton variant="outline" @click="handleClose">{{ t('common.cancel') }}</UiButton>
                <UiButton :disabled="isCreating || isUpdating" @click="handleSubmit(formRef)">
                    {{ isEditMode ? t('common.update') : t('common.create') }}
                </UiButton>
            </div>
        </template>
    </el-dialog>
</template>

<style scoped>
.hotspot-dialog :deep(.el-dialog__body) {
    padding: 0;
}

.hotspot-form-wrap {
    padding: var(--space-4);
}

.hotspot-form__row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), 1fr));
    gap: 0 var(--space-4);
}

.hotspot-form__full {
    width: 100%;
}

.hotspot-form__rating {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    width: 100%;
}

.hotspot-form__rating span {
    color: var(--color-text-muted);
    font-size: var(--text-sm);
}

.hotspot-images {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(5rem, 1fr));
    gap: var(--space-3);
    width: 100%;
}

.hotspot-images__item {
    position: relative;
    aspect-ratio: 1 / 1;
    overflow: hidden;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
}

.hotspot-images__item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.hotspot-images__remove {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-scrim);
    color: var(--color-inverse-text);
    opacity: 0;
    transition: opacity var(--transition-base);
}

.hotspot-images__item:hover .hotspot-images__remove {
    opacity: 1;
}

.hotspot-images__add {
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1 / 1;
    border: 1px dashed var(--color-border);
    border-radius: var(--radius-md);
    color: var(--color-text-muted);
    background: var(--color-bg-subtle);
    transition: border-color var(--transition-base), color var(--transition-base);
}

.hotspot-images__add:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
}

.hotspot-dialog__actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-3);
}
</style>
