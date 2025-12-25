<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus, Delete, Upload } from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus';
import type { Vehicle, CreateVehicleDto } from '~/types/api';
import { useCreateVehicleMutation, useUpdateVehicleMutation } from '~/composables/useVehiclesMutation';
import { useUploadImageMutation } from '~/composables/useBlogMutation';

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
    price_per_km: 0.5,
    thumbnail: '',
    amenities: [] as string[],
    is_available: true,
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
    price_per_km: [
        { required: true, message: 'Please input price per km', trigger: 'blur' },
    ],
});

const resetForm = () => {
    if (formRef.value) formRef.value.resetFields();
    Object.assign(formData, {
        model: '',
        type: 'Luxury Sedan',
        capacity: 4,
        price_per_km: 0.5,
        thumbnail: '',
        amenities: [],
        is_available: true,
    });
};

watch(() => props.vehicleData, (newData) => {
    if (newData) {
        Object.assign(formData, {
            model: newData.model,
            type: newData.type,
            capacity: newData.capacity,
            price_per_km: newData.price_per_km,
            thumbnail: newData.thumbnail,
            amenities: Array.isArray(newData.amenities) ? [...newData.amenities] : [],
            is_available: newData.is_available,
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
const handleThumbnailUpload = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    isUploading.value = true;
    try {
        const res = await uploadImage(input.files[0]);
        formData.thumbnail = res.url;
        ElMessage.success('Thumbnail uploaded successfully');
    } catch (error) {
        ElMessage.error('Upload failed');
    } finally {
        isUploading.value = false;
        input.value = '';
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
        class="rounded-2xl dark:bg-zinc-900 shadow-2xl" :before-close="handleClose">
        <el-form ref="formRef" :model="formData" :rules="rules" label-position="top" class="mt-4">
            <el-form-item :label="t('vehicles.model')" prop="model">
                <el-input v-model="formData.model" :placeholder="t('vehicles.model')" />
            </el-form-item>

            <div class="grid grid-cols-2 gap-4">
                <el-form-item :label="t('vehicles.type')" prop="type">
                    <el-select v-model="formData.type" class="w-full">
                        <el-option v-for="vType in vehicleTypes" :key="vType" :label="vType" :value="vType" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="t('vehicles.capacity')" prop="capacity">
                    <el-input-number v-model="formData.capacity" :min="1" class="w-full" />
                </el-form-item>
            </div>

            <el-form-item :label="t('vehicles.price_per_km')" prop="price_per_km">
                <el-input-number v-model="formData.price_per_km" :precision="2" :step="0.1" :min="0" class="w-full" />
            </el-form-item>

            <el-form-item :label="t('common.images')" prop="thumbnail">
                <div class="flex items-center gap-4">
                    <div v-if="formData.thumbnail" class="relative group w-24 h-24 rounded-lg overflow-hidden border">
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
                    :placeholder="t('vehicles.addAmenity')" class="w-full">
                    <el-option v-for="item in commonAmenities" :key="item" :label="item" :value="item" />
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-switch v-model="formData.is_available" :active-text="t('vehicles.available')"
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
</template>


<style scoped>
:deep(.el-dialog) {
    border-radius: 1.5rem;
}

:deep(.el-form-item__label) {
    font-weight: 600;
}
</style>
