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
const { mutateAsync: uploadImage } = useUploadImageMutation();

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

const rules = reactive<FormRules>({
    model: [
        { required: true, message: 'Please input model name', trigger: 'blur' },
    ],
    type: [
        { required: true, message: 'Please select type', trigger: 'change' },
    ],
    capacity: [
        { required: true, message: 'Please input capacity', trigger: 'blur' },
    ],
    pricePerKm: [
        { required: true, message: 'Please input price per km', trigger: 'blur' },
    ],
});

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

// Cropper State
const showCropper = ref(false);
const cropperImage = ref<string | null>(null);
const cropperRef = ref<any>(null);
const selectedFile = ref<File | null>(null);

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

                    const res = await uploadImage(file);
                    formData.thumbnail = res.url;
                    ElMessage.success('Thumbnail uploaded successfully');
                    showCropper.value = false;
                } catch (error) {
                    console.error(error);
                    ElMessage.error('Upload failed');
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
                ElMessage.error('Action failed');
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
    <el-dialog v-model="dialogVisible" :title="isEditMode ? t('vehicles.edit') : t('vehicles.create')" width="500px"
        class="rounded-2xl dark:bg-zinc-900 shadow-2xl [&_.el-dialog\_\_title]:dark:text-white"
        :before-close="handleClose">
        <el-form ref="formRef" :model="formData" :rules="rules" label-position="top" class="mt-4">
            <el-form-item :label="t('vehicles.model')" prop="model">
                <el-input class="[&_.el-input\_\_wrapper]:dark:bg-gray-800 [&_.el-input\_\_inner]:dark:text-white"
                    v-model="formData.model" :placeholder="t('vehicles.model')" />
            </el-form-item>

            <div class="grid grid-cols-2 gap-4">
                <el-form-item :label="t('vehicles.type')" prop="type">
                    <el-select v-model="formData.type"
                        class="w-full [&_.el-select\_\_wrapper]:dark:bg-gray-800 [&_.el-select\_\_selected-item]:dark:text-white">
                        <el-option v-for="vType in vehicleTypes" :key="vType" :label="vType" :value="vType" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="t('vehicles.capacity')" prop="capacity">
                    <el-input-number v-model="formData.capacity" :min="1"
                        class="w-full [&_.el-input\_\_wrapper]:dark:bg-gray-800 [&_.el-input-number\_\_decrease]:(dark:bg-gray-800 dark:text-white) [&_.el-input-number\_\_increase]:(dark:bg-gray-800 dark:text-white) [&_.el-input\_\_inner]:dark:text-white" />
                </el-form-item>
            </div>

            <el-form-item :label="t('vehicles.pricePerKm')" prop="pricePerKm">
                <el-input-number v-model="formData.pricePerKm" :precision="2" :step="0.1" :min="0"
                    class="w-full [&_.el-input\_\_wrapper]:dark:bg-gray-800 [&_.el-input-number\_\_decrease]:(dark:bg-gray-800 dark:text-white) [&_.el-input-number\_\_increase]:(dark:bg-gray-800 dark:text-white) [&_.el-input\_\_inner]:dark:text-white" />
            </el-form-item>

            <el-form-item :label="t('common.images')" prop="thumbnail">
                <div class="flex items-center gap-4">
                    <div v-if="formData.thumbnail" class="relative group w-auto h-24 rounded-lg overflow-hidden border">
                        <img :src="formData.thumbnail" class="w-full h-full object-cover" />
                        <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity"
                            @click="formData.thumbnail = ''">
                            <el-icon class="text-white">
                                <Delete />
                            </el-icon>
                        </div>
                    </div>
                    <div v-else
                        class="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
                        @click="fileInput?.click()">
                        <el-icon v-if="!isUploading" class="text-2xl text-zinc-400">
                            <Plus />
                        </el-icon>
                        <el-icon v-else class="text-2xl text-blue-500 is-loading">
                            <Upload />
                        </el-icon>
                    </div>
                    <input ref="fileInput" type="file" class="hidden" accept="image/*"
                        @change="handleThumbnailUpload" />
                </div>
            </el-form-item>

            <el-form-item :label="t('vehicles.amenities')">
                <el-select v-model="formData.amenities" multiple filterable allow-create default-first-option
                    :placeholder="t('vehicles.addAmenity')"
                    class="w-full [&_.el-select\_\_wrapper]:dark:bg-gray-800 [&_.el-select\_\_selected-item]:dark:text-white">
                    <el-option v-for="item in commonAmenities" :key="item" :label="item" :value="item" />
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-switch v-model="formData.isAvailable" :active-text="t('vehicles.available')"
                    :inactive-text="t('vehicles.unavailable')" />
            </el-form-item>
        </el-form>

        <template #footer>
            <div class="flex justify-end gap-2">
                <el-button @click="handleClose">
                    {{ t('common.cancel') }}
                </el-button>
                <el-button type="primary" :loading="isCreating || isUpdating" @click="handleSubmit(formRef)">
                    {{ isEditMode ? t('common.update') : t('common.create') }}
                </el-button>
            </div>
        </template>
    </el-dialog>

    <!-- Image Cropper Modal -->
    <el-dialog v-model="showCropper" title="Crop Image" width="600px" append-to-body :close-on-click-modal="false"
        destroy-on-close>
        <div
            class="h-96 w-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center overflow-hidden rounded-lg">
            <cropper ref="cropperRef" class="h-full w-full" :src="cropperImage" :stencil-props="{
                aspectRatio: 16 / 9
            }" />
        </div>
        <template #footer>
            <div class="flex justify-end gap-3">
                <el-button @click="showCropper = false">{{ t('common.cancel') }}</el-button>
                <el-button type="primary" :loading="isUploading" @click="onCrop">{{ t('common.confirm') }}</el-button>
            </div>
        </template>
    </el-dialog>
</template>


<style scoped>
:deep(.el-dialog) {
    border-radius: 1.5rem;
}

:deep(.el-form-item__label) {
    font-weight: 600;
}
</style>
