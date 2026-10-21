<script setup lang="ts">
import { Plus, Delete, Upload } from '@element-plus/icons-vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import type { Vehicle, CreateVehicleDto } from '~/types/api';

import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

const props = defineProps<{
    modelValue: boolean;
    vehicleData?: Vehicle | null;
}>();

const emit = defineEmits(['update:modelValue', 'success']);

const { t } = useI18n();
const { mutateAsync: createVehicle, isPending: isCreating } = useCreateVehicleMutation();
const { mutateAsync: updateVehicle, isPending: isUpdating } = useUpdateVehicleMutation();
const { mutateAsync: uploadImage } = useUploadMutation();

const dialogVisible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
});

const isEditMode = computed(() => !!props.vehicleData);
const formRef = ref<FormInstance>();

const formData = reactive({
    model: '',
    type: 'Luxury Sedan',
    capacity: 4,
    pricePerKm: 0.5,
    thumbnail: '',
    amenities: [] as string[],
    isAvailable: true,
});

// Computed để thông báo lỗi cập nhật theo ngôn ngữ đang chọn.
const rules = computed<FormRules>(() => ({
    model: [
        { required: true, message: t('vehicles.validation.model'), trigger: 'blur' },
    ],
    type: [
        { required: true, message: t('vehicles.validation.type'), trigger: 'change' },
    ],
    capacity: [
        { required: true, message: t('vehicles.validation.capacity'), trigger: 'blur' },
    ],
    pricePerKm: [
        { required: true, message: t('vehicles.validation.pricePerKm'), trigger: 'blur' },
    ],
}));

const resetForm = () => {
    if (formRef.value) formRef.value.resetFields();
    Object.assign(formData, {
        model: '',
        type: 'Luxury Sedan',
        capacity: 4,
        pricePerKm: 0.5,
        thumbnail: '',
        amenities: [],
        isAvailable: true,
    });
};

watch(() => props.vehicleData, (newData) => {
    if (newData) {
        Object.assign(formData, {
            model: newData.model,
            type: newData.type,
            capacity: newData.capacity,
            pricePerKm: newData.pricePerKm,
            thumbnail: newData.thumbnail,
            amenities: Array.isArray(newData.amenities) ? [...newData.amenities] : [],
            isAvailable: newData.isAvailable,
        });
    } else {
        resetForm();
    }
}, { immediate: true });



const vehicleTypes = [
    'Luxury Sedan',
    'SUV',
    'Minivan',
    'Luxury Van',
    'Bus',
    'Motorbike',
    'Classic Car'
];

const commonAmenities = [
    'Air Conditioning',
    'Leather Seats',
    'GPS Navigation',
    'WiFi',
    'Music System',
    'Sunroof',
    'Blind Spot Monitor',
    'Rear Camera',
    'Bottled Water',
    'Professional Driver',
    'First Aid Kit',
];

const isUploading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

// Responsive dialog width
const dialogWidth = computed(() => {
    if (typeof window !== 'undefined') {
        return window.innerWidth < 640 ? '95vw' : '500px'
    }
    return '500px'
})

// Cropper State
const showCropper = ref(false);
const cropperImage = ref<string | null>(null);
const cropperRef = ref<any>(null);
const selectedFile = ref<File | null>(null);
const cropperDialogWidth = computed(() => {
    if (typeof window !== 'undefined') {
        return window.innerWidth < 640 ? '95vw' : '600px'
    }
    return '600px'
})

const handleThumbnailUpload = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    selectedFile.value = file;

    // Create preview for cropper
    const reader = new FileReader();
    reader.onload = (e) => {
        cropperImage.value = e.target?.result as string;
        showCropper.value = true;
    };
    reader.readAsDataURL(file);

    // Reset input so same file can be selected again
    input.value = '';
};

const onCrop = async () => {
    if (!cropperRef.value) return;

    const { canvas } = cropperRef.value.getResult();
    if (canvas) {
        canvas.toBlob(async (blob: Blob) => {
            if (blob) {
                isUploading.value = true;
                try {
                    // Create a new file from the blob
                    const file = new File([blob], selectedFile.value?.name || 'image.jpg', {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    });

                    const res = await uploadImage({ file, folder: 'vehicles' });
                    formData.thumbnail = res.url;
                    ElMessage.success(t('common.thumbnailUploaded'));
                    showCropper.value = false;
                } catch (error) {
                    console.error(error);
                    ElMessage.error(t('common.uploadFailed'));
                } finally {
                    isUploading.value = false;
                }
            }
        }, 'image/jpeg', 0.8); // 0.8 quality
    }
};

const handleSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate(async (valid) => {
        if (valid) {
            try {
                if (isEditMode.value && props.vehicleData) {
                    await updateVehicle({ id: props.vehicleData.id, data: formData });
                    ElMessage.success(t('vehicles.updateSuccess'));
                } else {
                    await createVehicle(formData as CreateVehicleDto);
                    ElMessage.success(t('vehicles.createSuccess'));
                }
                emit('success');
                handleClose();
            } catch (error) {
                ElMessage.error(t('common.actionFailed'));
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
    <el-dialog v-model="dialogVisible" :title="isEditMode ? t('vehicles.edit') : t('vehicles.create')"
        :width="dialogWidth" class="vehicle-dialog" :before-close="handleClose">
        <el-form ref="formRef" :model="formData" :rules="rules" label-position="top" class="vehicle-form">
            <el-form-item :label="t('vehicles.model')" prop="model">
                <el-input v-model="formData.model" :placeholder="t('vehicles.model')" />
            </el-form-item>

            <div class="vehicle-form__row">
                <el-form-item :label="t('vehicles.type')" prop="type">
                    <el-select v-model="formData.type" class="vehicle-form__full">
                        <el-option v-for="vType in vehicleTypes" :key="vType" :label="vType" :value="vType" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="t('vehicles.capacity')" prop="capacity">
                    <el-input-number v-model="formData.capacity" :min="1" class="vehicle-form__full" />
                </el-form-item>
            </div>

            <el-form-item :label="t('vehicles.pricePerKm')" prop="pricePerKm">
                <el-input-number v-model="formData.pricePerKm" :precision="2" :step="0.1" :min="0"
                    class="vehicle-form__full" />
            </el-form-item>

            <el-form-item :label="t('common.images')" prop="thumbnail">
                <div class="vehicle-thumb">
                    <div v-if="formData.thumbnail" class="vehicle-thumb__preview">
                        <img :src="formData.thumbnail" :alt="formData.model">
                        <button type="button" class="vehicle-thumb__remove" :aria-label="t('common.remove')"
                            @click="formData.thumbnail = ''">
                            <el-icon>
                                <Delete />
                            </el-icon>
                        </button>
                    </div>
                    <button v-else type="button" class="vehicle-thumb__add" @click="fileInput?.click()">
                        <el-icon v-if="!isUploading">
                            <Plus />
                        </el-icon>
                        <el-icon v-else class="is-loading">
                            <Upload />
                        </el-icon>
                    </button>
                    <input ref="fileInput" type="file" class="visually-hidden" accept="image/*"
                        @change="handleThumbnailUpload">
                </div>
                <!-- Ảnh từ URL dùng nguyên bản, không qua bước cắt như ảnh tải lên -->
                <UiImageUrlInput class="vehicle-thumb__url" :disabled="isUploading"
                    @submit="([url]) => { if (url) formData.thumbnail = url }" />
            </el-form-item>

            <el-form-item :label="t('vehicles.amenities')">
                <el-select v-model="formData.amenities" multiple filterable allow-create default-first-option
                    :placeholder="t('vehicles.addAmenity')" class="vehicle-form__full">
                    <el-option v-for="item in commonAmenities" :key="item" :label="item" :value="item" />
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-switch v-model="formData.isAvailable" :active-text="t('vehicles.available')"
                    :inactive-text="t('vehicles.unavailable')" />
            </el-form-item>
        </el-form>

        <template #footer>
            <div class="vehicle-dialog__actions">
                <UiButton variant="outline" @click="handleClose">{{ t('common.cancel') }}</UiButton>
                <UiButton :disabled="isCreating || isUpdating" @click="handleSubmit(formRef)">
                    {{ isEditMode ? t('common.update') : t('common.create') }}
                </UiButton>
            </div>
        </template>
    </el-dialog>

    <!-- Image Cropper Modal -->
    <el-dialog v-model="showCropper" :title="t('common.cropImage')" :width="cropperDialogWidth" append-to-body
        :close-on-click-modal="false" destroy-on-close class="vehicle-cropper-dialog">
        <div class="vehicle-cropper">
            <cropper ref="cropperRef" class="vehicle-cropper__canvas" :src="cropperImage" :stencil-props="{
                aspectRatio: 16 / 9
            }" />
        </div>
        <template #footer>
            <div class="vehicle-dialog__actions">
                <UiButton variant="outline" @click="showCropper = false">{{ t('common.cancel') }}</UiButton>
                <UiButton :disabled="isUploading" @click="onCrop">{{ t('common.confirm') }}</UiButton>
            </div>
        </template>
    </el-dialog>
</template>

<style scoped>
.vehicle-form {
    margin-top: var(--space-2);
}

.vehicle-form__row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 9rem), 1fr));
    gap: 0 var(--space-4);
}

.vehicle-form__full {
    width: 100%;
}

.vehicle-thumb {
    display: flex;
    align-items: center;
    gap: var(--space-4);
}

.vehicle-thumb__preview {
    position: relative;
    width: 7rem;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
}

.vehicle-thumb__preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.vehicle-thumb__remove {
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

.vehicle-thumb__preview:hover .vehicle-thumb__remove {
    opacity: 1;
}

.vehicle-thumb__url {
    margin-top: var(--space-3);
}

.vehicle-thumb__add {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 7rem;
    aspect-ratio: 4 / 3;
    border: 1px dashed var(--color-border);
    border-radius: var(--radius-md);
    color: var(--color-text-muted);
    transition: border-color var(--transition-base), color var(--transition-base);
}

.vehicle-thumb__add:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
}

.vehicle-dialog__actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-3);
}

.vehicle-cropper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 24rem;
    overflow: hidden;
    border-radius: var(--radius-md);
    background: var(--color-bg-subtle);
}

.vehicle-cropper__canvas {
    width: 100%;
    height: 100%;
}
</style>
