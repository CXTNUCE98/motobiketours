<script setup lang="ts">
import { ElMessage, ElMessageBox, type FormRules } from 'element-plus';
import { Upload, Picture, Delete, ArrowRight, ArrowLeft, Check, Loading, Menu, Plus } from '@element-plus/icons-vue';
import { type Tour, type HotSpot, type Vehicle } from '~/types/api';
import draggable from 'vuedraggable';

interface ItineraryItem {
    hotSpotId: string;
    activityDescription: string;
    durationMinutes: number;
}

interface TourForm {
    title: string;
    type: string[];
    priceUsd: number;
    duration: string;
    durationRange: string;
    departFrom: string;
    routes: string;
    description: string;
    content: string;
    thumbnail: string;
    images: string[];
    isFeatured: boolean;
    suggestedVehicleId: string | null;
    itineraries: ItineraryItem[];
    discount: number;
}

const { t } = useI18n();

const props = defineProps<{
    visible: boolean;
    tourData?: Tour | null;
}>();

const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void;
    (e: 'success'): void;
}>();

// State
const dialogVisible = computed({
    get: () => props.visible,
    set: (val: boolean) => emit('update:visible', val)
});

const isEditMode = computed(() => !!props.tourData);
const currentStep = ref(0);
const formRef = ref();

const durationOptions = [
    {
        label: '1 day',
        value: '1 day'
    },
    {
        label: '1 day 1 night',
        value: '1 day 1 night'
    },
    {
        label: '2 days 1 night',
        value: '2 days 1 night'
    },
    {
        label: '3 days 2 nights',
        value: '3 days 2 nights'
    },
    {
        label: '4 days 3 nights',
        value: '4 days 3 nights'
    },
    {
        label: '5 days 4 nights',
        value: '5 days 4 nights'
    },
    {
        label: '6 days 5 nights',
        value: '6 days 5 nights'
    }
]
const mapDurationRange: Record<string, string> = {
    '1 day': '1-3',
    '1 day 1 night': '1-3',
    '2 days 1 night': '1-3',
    '3 days 2 nights': '1-3',
    '4 days 3 nights': '4-7',
    '5 days 4 nights': '4-7',
    '6 days 5 nights': '4-7'
} as const;

// Form Data
const formData = reactive<TourForm>({
    title: '',
    type: [],
    priceUsd: 0,
    duration: '',
    durationRange: '',
    departFrom: '',
    routes: '',
    description: '',
    content: '',
    thumbnail: '',
    images: [],
    isFeatured: false,
    suggestedVehicleId: null,
    itineraries: [],
    discount: 0
});

const { data: vehicles } = useVehiclesQuery();
const { data: hotSpots } = useHotSpotsQuery(ref({}));

const addItineraryItem = () => {
    formData.itineraries.push({
        hotSpotId: '',
        activityDescription: '',
        durationMinutes: 0
    });
};

const removeItineraryItem = (index: number) => {
    formData.itineraries.splice(index, 1);
};

// File Handling
const thumbnailPreview = ref<string>('');
const galleryPreviews = ref<string[]>([]);
const thumbnailInput = ref<any>(null);
const galleryInput = ref<any>(null);
const isUploading = ref(false);

// Validation Rules
const rules: FormRules = {
    title: [
        { required: true, message: t('tour.validation.titleRequired'), trigger: 'blur' },
        { min: 3, message: t('tour.validation.titleMin'), trigger: 'blur' }
    ],
    type: [
        { required: true, message: t('tour.validation.typeRequired'), trigger: 'change' }
    ],
    priceUsd: [
        { required: true, message: t('tour.validation.priceRequired'), trigger: 'blur' },
        {
            type: 'number' as const,
            min: 1,
            message: t('tour.validation.priceMin'),
            trigger: 'blur'
        }
    ],
    duration: [
        { required: true, message: t('tour.validation.durationRequired'), trigger: 'blur' }
    ],
    departFrom: [
        { required: true, message: t('tour.validation.departFromRequired'), trigger: 'blur' }
    ],
    routes: [
        { required: true, message: t('tour.validation.routesRequired'), trigger: 'blur' }
    ],
    description: [
        { required: true, message: t('tour.validation.descriptionRequired'), trigger: 'blur' },
        { min: 10, message: t('tour.validation.descriptionMin'), trigger: 'blur' }
    ],
    content: [
        { required: true, message: t('tour.validation.contentRequired'), trigger: 'blur' }
    ]
};

// Helper function to check if URL is a blob URL
const isBlobURL = (url: string): boolean => {
    return url.startsWith('blob:');
};

// Cleanup function to revoke all object URLs
const cleanupObjectURLs = () => {
    // Cleanup thumbnail preview
    if (thumbnailPreview.value && isBlobURL(thumbnailPreview.value)) {
        URL.revokeObjectURL(thumbnailPreview.value);
    }

    // Cleanup gallery previews
    galleryPreviews.value.forEach((url: string) => {
        if (url && isBlobURL(url)) {
            URL.revokeObjectURL(url);
        }
    });
};

// Reset Form
const resetForm = () => {
    // Cleanup blob URLs
    cleanupObjectURLs();

    Object.assign(formData, {
        title: '',
        type: [],
        priceUsd: 0,
        duration: '',
        durationRange: '',
        departFrom: '',
        routes: '',
        description: '',
        content: '',
        thumbnail: '',
        images: [],
        isFeatured: false,
        suggestedVehicleId: null,
        itineraries: [],
        discount: 0
    });
    thumbnailPreview.value = '';
    galleryPreviews.value = [];
    currentStep.value = 0;
    if (thumbnailInput.value) thumbnailInput.value.value = '';
    if (galleryInput.value) galleryInput.value.value = '';
};

// Watch for edit mode
watch(() => props.tourData, (newVal) => {
    if (isEditMode.value && newVal) {
        // Cleanup blob URLs before setting new data
        cleanupObjectURLs();

        // Gán dữ liệu tường minh để tránh dính ratingStats, reviews, etc.
        formData.title = newVal.title || '';
        formData.type = Array.isArray(newVal.type) ? [...newVal.type] : [];
        formData.priceUsd = newVal.priceUsd || 0;
        formData.duration = newVal.duration || '';
        formData.durationRange = newVal.durationRange || '';
        formData.departFrom = newVal.departFrom || '';
        formData.routes = newVal.routes || '';
        formData.description = newVal.description || '';
        formData.content = newVal.content || '';
        formData.thumbnail = newVal.thumbnail || '';
        formData.images = Array.isArray(newVal.images) ? [...newVal.images] : [];
        formData.isFeatured = !!newVal.isFeatured;
        formData.suggestedVehicleId = newVal.suggestedVehicleId || null;
        formData.discount = newVal.discount || 0;

        // Map itineraries from response to form format
        if (newVal.itineraries) {
            formData.itineraries = newVal.itineraries.map(item => ({
                hotSpotId: item.hotSpot?.id || '',
                activityDescription: item.activityDescription || '',
                durationMinutes: item.durationMinutes || 0
            }));
        } else {
            formData.itineraries = [];
        }

        thumbnailPreview.value = newVal.thumbnail || '';
        galleryPreviews.value = Array.isArray(newVal.images) ? [...newVal.images] : [];
    } else {
        resetForm();
    }
}, { immediate: true });

const { mutateAsync: uploadImageMutation } = useUploadMutation();
const { formatPrice } = useCurrency();

const handleThumbnailChange = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
        const file = input.files[0];
        if (file.size > 5 * 1024 * 1024) {
            ElMessage.error(t('tour.validation.imageSize'));
            return;
        }

        try {
            isUploading.value = true;
            const res = await uploadImageMutation({ file, folder: 'tours' });
            formData.thumbnail = res.url;
            thumbnailPreview.value = res.url;
            ElMessage.success(t('tour.message.thumbnailSuccess'));
        } catch (error) {
            ElMessage.error(t('tour.message.uploadError'));
        } finally {
            isUploading.value = false;
        }
    }
};

const removeThumbnail = () => {
    formData.thumbnail = '';
    thumbnailPreview.value = '';
    if (thumbnailInput.value) thumbnailInput.value.value = '';
};

const handleGalleryChange = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files) {
        const newFiles = Array.from(input.files);
        const validFiles = newFiles.filter(file => file.size <= 5 * 1024 * 1024);

        if (validFiles?.length < newFiles?.length) {
            ElMessage.warning(t('tour.message.imageLimitWarning'));
        }

        try {
            isUploading.value = true;
            for (const file of validFiles) {
                const res = await uploadImageMutation({ file, folder: 'tours' });
                formData.images.push(res.url);
                galleryPreviews.value.push(res.url);
            }
            ElMessage.success(t('tour.message.gallerySuccess', { count: validFiles.length }));
        } catch (error) {
            ElMessage.error(t('tour.message.uploadError'));
        } finally {
            isUploading.value = false;
        }
    }
};

const removeGalleryImage = (index: number) => {
    formData.images.splice(index, 1);
    galleryPreviews.value.splice(index, 1);
};

const nextStep = async () => {
    // if (currentStep.value === 0) {
    //     if (!formRef.value) return;
    //     await formRef.value.validate((valid: boolean) => {
    //         if (valid) currentStep.value++;
    //     });
    // } else if (currentStep.value === 1) {
    //     if (!thumbnailFile.value && !formData.thumbnail) {
    //         ElMessage.warning('Vui lòng chọn ảnh đại diện');
    //         return;
    //     }
    //     currentStep.value++;
    // } else if (currentStep.value === 2) {
    //     if (!formData.content) {
    //         ElMessage.warning('Vui lòng nhập nội dung chi tiết');
    //         return;
    //     }
    //     currentStep.value++;
    // }
    currentStep.value++;
};


const prevStep = () => {
    if (currentStep.value > 0) currentStep.value--;
};

// Create Tour Mutation
const { mutate: createTourMutation, isPending: isCreating } = useCreateTourMutation();

// Update Tour Mutation
const { mutate: updateTourMutation, isPending: isUpdating } = useUpdateTourMutation();

const isSubmitting = computed(() => isCreating.value || isUpdating.value || isUploading.value);

const handleClose = () => {
    ElMessageBox.confirm(t('tour.message.cancelConfirm'), t('common.warning'), {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
    }).then(() => {
        dialogVisible.value = false;
        resetForm();
    }).catch(() => { });
};

const handleSubmit = async () => {
    // Use JSON for update/create
    const submitData = {
        ...formData,
        // Explicitly include images array (even if empty)
        images: formData.images,
        // Ensure itineraries is formatted correctly
        itineraries: formData.itineraries.map((item: any) => ({
            hotSpotId: item.hotSpotId,
            activityDescription: item.activityDescription,
            durationMinutes: item.durationMinutes
        }))
    };
    // Remove meta fields if they exist in formData
    delete (submitData as any).id;
    delete (submitData as any).createdAt;
    delete (submitData as any).ratingStats;
    delete (submitData as any).reviews;
    delete (submitData as any).suggestedVehicle;
    delete (submitData as any).durationDays;

    if (isEditMode.value && props.tourData?.id) {
        updateTourMutation({ id: props.tourData.id, data: submitData }, {
            onSuccess: () => {
                ElMessage.success(t('tour.message.updateSuccess'));
                emit('success');
                dialogVisible.value = false;
                resetForm();
            },
            onError: (error: any) => {
                ElMessage.error(error.message || t('tour.message.updateError'));
            }
        });
    } else {
        createTourMutation(submitData, {
            onSuccess: () => {
                ElMessage.success(t('tour.message.createSuccess'));
                emit('success');
                dialogVisible.value = false;
                resetForm();
            },
            onError: (error: any) => {
                ElMessage.error(error.message || t('tour.message.createError'));
            }
        });
    }
};

function handleUpdateDuration(value: string) {
    formData.durationRange = mapDurationRange[value] || '';
}

// Cleanup on component unmount
onBeforeUnmount(() => {
    cleanupObjectURLs();
});
</script>


<template>
    <el-dialog v-model="dialogVisible" :title="isEditMode ? 'Chỉnh sửa Tour' : 'Tạo Tour Mới'" width="90%"
        class="create-tour-dialog dark:bg-gray-800 [&_.el-dialog\_\_title]:dark:text-white"
        :close-on-click-modal="false" destroy-on-close lock-scroll :align-center="true">
        <div class="flex h-[80vh]">
            <!-- Steps Sidebar -->
            <div
                class="w-64 bg-gray-50 dark:bg-gray-800 border-r [&_.el-step\_\_title]:dark:text-white [&_.el-step\_\_description]:dark:text-white border-gray-200 dark:border-gray-700 p-6">
                <el-steps direction="vertical" :active="currentStep" finish-status="success">
                    <el-step :title="t('tour.steps.basicInfo')" :description="t('tour.steps.basicInfoDesc')" />
                    <el-step :title="t('tour.steps.images')" :description="t('tour.steps.imagesDesc')" />
                    <el-step :title="t('tour.steps.itinerary')" :description="t('tour.steps.itineraryDesc')" />
                    <el-step :title="t('tour.steps.details')" :description="t('tour.steps.detailsDesc')" />
                    <el-step :title="t('tour.steps.confirm')" :description="t('tour.steps.confirmDesc')" />
                </el-steps>
            </div>

            <!-- Main Content -->
            <div class="flex-1 overflow-y-auto p-8 bg-white dark:bg-gray-900">
                <el-form ref="formRef" :model="formData" :rules="rules" label-position="top" class="max-w-4xl mx-auto">

                    <!-- Step 1: Basic Info -->
                    <div v-show="currentStep === 0" class="space-y-6 animate-fade-in">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <el-form-item :label="t('tour.form.title')" prop="title"
                                class="[&_.el-form-item\_\_label]:dark:text-white">
                                <el-input v-model="formData.title"
                                    class="[&_.el-input\_\_wrapper]:dark:bg-gray-800 [&_.el-input\_\_inner]:dark:text-white"
                                    :placeholder="t('tour.form.titlePlaceholder')" size="large" />
                            </el-form-item>

                            <el-form-item :label="t('tour.form.type')" prop="type"
                                class="[&_.el-form-item\_\_label]:dark:text-white">
                                <el-select v-model="formData.type" multiple
                                    :placeholder="t('tour.form.typePlaceholder')" size="large"
                                    class="w-full [&_.el-select\_\_wrapper]:dark:bg-gray-800 [&_.el-select\_\_selected-item]:dark:text-white">
                                    <el-option v-for="(label, value) in t('tour.types' as any)" :key="value"
                                        :label="label" :value="value" />
                                </el-select>
                            </el-form-item>

                            <el-form-item :label="t('tour.form.price')" prop="priceUsd"
                                class="[&_.el-form-item\_\_label]:dark:text-white">
                                <el-input-number v-model="formData.priceUsd" :min="0" :step="10" size="large"
                                    class="w-full [&_.el-input\_\_wrapper]:dark:bg-gray-800 [&_.el-input-number\_\_decrease]:(dark:bg-gray-800 dark:text-white) [&_.el-input-number\_\_increase]:(dark:bg-gray-800 dark:text-white) [&_.el-input\_\_inner]:dark:text-white" />
                            </el-form-item>

                            <el-form-item :label="t('tour.form.discount') || 'Giảm giá (%)'" prop="discount"
                                class="[&_.el-form-item\_\_label]:dark:text-white">
                                <el-input-number v-model="formData.discount" :min="0" :max="100" :step="5" size="large"
                                    class="w-full [&_.el-input-number\_\_decrease]:(dark:bg-gray-800 dark:text-white) [&_.el-input-number\_\_increase]:(dark:bg-gray-800 dark:text-white) [&_.el-input\_\_inner]:dark:text-white" />
                            </el-form-item>

                            <el-form-item :label="t('tour.form.duration')" prop="duration"
                                class="[&_.el-form-item\_\_label]:dark:text-white">
                                <el-select v-model="formData.duration" :placeholder="t('tour.form.durationPlaceholder')"
                                    size="large"
                                    class="w-full [&_.el-select\_\_wrapper]:dark:bg-gray-800 [&_.el-select\_\_selected-item]:dark:text-white"
                                    @change="handleUpdateDuration">
                                    <el-option v-for="option in durationOptions" :key="option.value"
                                        :label="t('tour.durationOptions.' + option.value.replace(/\s/g, '') as any)"
                                        :value="option.value" />
                                </el-select>
                            </el-form-item>

                            <el-form-item :label="t('tour.form.departFrom')" prop="departFrom"
                                class="[&_.el-form-item\_\_label]:dark:text-white">
                                <el-input v-model="formData.departFrom"
                                    class="[&_.el-input\_\_wrapper]:dark:bg-gray-800 [&_.el-input\_\_inner]:dark:text-white"
                                    :placeholder="t('tour.form.departFromPlaceholder')" size="large" />
                            </el-form-item>

                            <el-form-item :label="t('tour.form.routes')" prop="routes"
                                class="[&_.el-form-item\_\_label]:dark:text-white">
                                <el-input v-model="formData.routes"
                                    class="[&_.el-input\_\_wrapper]:dark:bg-gray-800 [&_.el-input\_\_inner]:dark:text-white"
                                    :placeholder="t('tour.form.routesPlaceholder')" size="large" />
                            </el-form-item>
                        </div>

                        <el-form-item :label="t('tour.form.featured')"
                            class="[&_.el-form-item\_\_label]:dark:text-white">
                            <el-switch v-model="formData.isFeatured" class="[&_.el-switch\_\_core]:dark:bg-gray-800"
                                :active-text="t('common.yes')" :inactive-text="t('common.no')" />
                        </el-form-item>
                    </div>

                    <!-- Step 2: Images -->
                    <div v-show="currentStep === 1" class="space-y-8 animate-fade-in">
                        <!-- Thumbnail Upload -->
                        <div
                            class="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
                            <h3 class="text-lg font-semibold mb-4 dark:text-white">{{ t('tour.form.thumbnail') }}</h3>
                            <div class="flex items-center gap-6 ">
                                <div v-if="thumbnailPreview || isUploading"
                                    class="relative w-48 h-32 rounded-lg overflow-hidden shadow-md group bg-gray-100 dark:bg-gray-700">
                                    <img v-if="thumbnailPreview" :src="thumbnailPreview"
                                        class="w-full h-full object-cover" :class="{ 'opacity-50': isUploading }" />
                                    <div v-if="isUploading" class="absolute inset-0 flex items-center justify-center">
                                        <el-icon class="is-loading text-3xl text-primary">
                                            <Loading />
                                        </el-icon>
                                    </div>
                                    <div v-if="thumbnailPreview && !isUploading"
                                        class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <el-button type="danger" circle :icon="Delete" @click="removeThumbnail" />
                                    </div>
                                </div>
                                <div class="flex-1">
                                    <input type="file" ref="thumbnailInput" accept="image/*" class="hidden"
                                        @change="handleThumbnailChange" />
                                    <el-button type="primary" :icon="Upload" @click="thumbnailInput?.click()"
                                        :loading="isUploading">
                                        {{ t('common.chooseImage') }}
                                    </el-button>
                                    <p class="mt-2 text-sm text-gray-500 dark:text-white">{{ t('tour.form.imageRule') }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Gallery Upload -->
                        <div
                            class="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
                            <h3 class="text-lg font-semibold mb-4 dark:text-white">{{ t('tour.form.gallery') }}</h3>
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div v-for="(url, index) in galleryPreviews" :key="index"
                                    class="relative aspect-video rounded-lg overflow-hidden shadow-sm group">
                                    <img :src="url" class="w-full h-full object-cover" />
                                    <div
                                        class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <el-button type="danger" circle :icon="Delete" size="small"
                                            @click="removeGalleryImage(index)" />
                                    </div>
                                </div>
                                <!-- Loading Card -->
                                <div v-if="isUploading"
                                    class="relative aspect-video rounded-lg overflow-hidden shadow-sm bg-gray-100 dark:bg-gray-700 flex flex-col items-center justify-center border border-dashed border-primary/30">
                                    <el-icon class="is-loading text-2xl text-primary mb-2">
                                        <Loading />
                                    </el-icon>
                                    <span class="text-xs text-gray-500 dark:text-gray-400">{{ t('common.uploading')
                                    }}</span>
                                </div>
                            </div>
                            <input type="file" ref="galleryInput" accept="image/*" multiple class="hidden"
                                @change="handleGalleryChange" />
                            <el-button type="primary" plain :icon="Picture" @click="galleryInput?.click()"
                                :loading="isUploading">
                                {{ t('tour.form.addToGallery') }}
                            </el-button>
                        </div>
                    </div>

                    <!-- Step 3: Itinerary & Vehicle -->
                    <div v-show="currentStep === 2" class="space-y-6 animate-fade-in">
                        <h3 class="text-xl font-bold dark:text-white mb-4">{{ t('tour.form.suggestedVehicle') }}</h3>
                        <el-form-item :label="t('tour.form.suggestedVehicle')"
                            class="[&_.el-form-item\_\_label]:dark:text-white">
                            <el-select v-model="formData.suggestedVehicleId"
                                :placeholder="t('tour.form.suggestedVehiclePlaceholder')" size="large"
                                class="w-full [&_.el-select\_\_wrapper]:dark:bg-gray-800 [&_.el-select\_\_selected-item]:dark:text-white"
                                clearable>
                                <el-option v-for="v in vehicles" :key="v.id" :label="`${v.model} (${v.capacity} seats)`"
                                    :value="v.id" />
                            </el-select>
                        </el-form-item>

                        <div class="mt-8">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="text-xl font-bold dark:text-white">{{ t('tour.form.itineraryTitle') }}</h3>
                                <el-button type="primary" :icon="Plus" circle @click="addItineraryItem" />
                            </div>

                            <div class="space-y-4">
                                <draggable v-model="formData.itineraries" item-key="hotSpotId" handle=".drag-handle">
                                    <template #item="{ element, index }">
                                        <div
                                            class="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex gap-4 items-start mb-4">
                                            <div class="drag-handle cursor-move pt-2 text-gray-400">
                                                <el-icon>
                                                    <Menu />
                                                </el-icon>
                                            </div>

                                            <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <el-form-item :label="t('tour.form.hotSpot')"
                                                    class="mb-0 [&_.el-form-item\_\_label]:dark:text-white">
                                                    <el-select v-model="element.hotSpotId" filterable
                                                        :placeholder="t('tour.form.hotSpot')" class="w-full">
                                                        <el-option v-for="spot in hotSpots" :key="spot.id"
                                                            :label="spot.name" :value="spot.id" />
                                                    </el-select>
                                                </el-form-item>

                                                <el-form-item :label="t('tour.form.durationMinutes')"
                                                    class="mb-0 [&_.el-form-item\_\_label]:dark:text-white">
                                                    <el-input-number v-model="element.durationMinutes" :min="0"
                                                        class="w-full" />
                                                </el-form-item>

                                                <el-form-item :label="t('tour.form.activity')"
                                                    class="md:col-span-2 mb-0 [&_.el-form-item\_\_label]:dark:text-white">
                                                    <el-input v-model="element.activityDescription"
                                                        :placeholder="t('tour.form.activityPlaceholder')" />
                                                </el-form-item>
                                            </div>

                                            <el-button type="danger" :icon="Delete" circle plain class="mt-8"
                                                @click="removeItineraryItem(index)" />
                                        </div>
                                    </template>
                                </draggable>

                                <div v-if="formData.itineraries.length === 0"
                                    class="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                                    <p class="text-gray-500">{{ t('tour.form.noStops') }}</p>
                                </div>

                                <el-button v-else type="primary" plain class="w-full" @click="addItineraryItem">
                                    + {{ t('tour.form.addStop') }}
                                </el-button>
                            </div>
                        </div>
                    </div>

                    <!-- Step 4: Content -->
                    <div v-show="currentStep === 3" class="space-y-6 animate-fade-in">
                        <el-form-item :label="t('tour.form.description')" prop="description">
                            <el-input v-model="formData.description"
                                class="[&_.el-textarea\_\_inner]:dark:bg-gray-800 [&_.el-textarea\_\_inner]:dark:text-white"
                                type="textarea" :rows="3" :placeholder="t('tour.form.descriptionPlaceholder')" />
                        </el-form-item>

                        <el-form-item :label="t('tour.form.content')" prop="content">
                            <div class="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                                <ClientOnly>
                                    <QuillEditor v-model:content="formData.content" contentType="html" theme="snow"
                                        toolbar="full" style="height: 400px" />
                                </ClientOnly>
                            </div>
                        </el-form-item>
                    </div>

                    <!-- Step 5: Confirmation -->
                    <div v-show="currentStep === 4" class="space-y-6 animate-fade-in">
                        <div
                            class="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
                            <h3 class="text-xl font-bold text-blue-800 dark:text-blue-300 mb-4">{{
                                t('tour.steps.confirmTitle') }}</h3>
                            <div class="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                                <div><span class="font-semibold">{{ t('tour.form.title') }}:</span> {{ formData.title }}
                                </div>
                                <div><span class="font-semibold">{{ t('tour.form.priceLabel') }}</span> {{
                                    formatPrice(formData.priceUsd)
                                }}</div>
                                <div><span class="font-semibold">{{ t('tour.form.duration') }}:</span> {{
                                    formData.duration }}</div>
                                <div><span class="font-semibold">{{ t('tour.form.type') }}:</span> {{ formData.type }}
                                </div>
                                <div><span class="font-semibold">{{ t('tour.form.departFromLabel') }}</span> {{
                                    formData.departFrom }}
                                </div>
                                <div><span class="font-semibold">{{ t('tour.form.vehicleLabel') }}</span> {{
                                    vehicles?.find((v: any) => v.id
                                        === formData.suggestedVehicleId)?.model || t('common.no')}}</div>
                                <div class="col-span-2">
                                    <span class="font-semibold block mb-2">{{ t('tour.form.itineraryLabel', {
                                        count:
                                            formData.itineraries.length
                                    }) }}</span>
                                    <div class="space-y-1 pl-4 border-l-2 border-primary/30">
                                        <div v-for="(item, idx) in formData.itineraries" :key="idx" class="text-xs">
                                            {{ Number(idx) + 1 }}. {{hotSpots?.find((s: any) => s.id ===
                                                item.hotSpotId)?.name}}
                                            <span v-if="item.durationMinutes">({{ item.durationMinutes }} {{
                                                t('hotSpots.minutes' as any)
                                                || 'phút' }})</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-span-2">
                                    <span class="font-semibold block mb-2">{{ t('tour.form.thumbnailLabel') }}</span>
                                    <div v-if="thumbnailPreview"
                                        class="w-40 h-24 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                        <img :src="thumbnailPreview" class="w-full h-full object-cover" />
                                    </div>
                                    <span v-else class="text-gray-400 italic">{{ t('tour.form.noThumbnail') }}</span>
                                </div>
                                <div class="col-span-2">
                                    <span class="font-semibold block mb-2">{{ t('tour.form.galleryLabel', {
                                        count:
                                            galleryPreviews?.length
                                    }) }}</span>
                                    <div class="flex flex-wrap gap-3">
                                        <div v-for="(url, idx) in galleryPreviews" :key="idx"
                                            class="w-24 h-16 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                            <img :src="url" class="w-full h-full object-cover" />
                                        </div>
                                        <span v-if="galleryPreviews.length === 0" class="text-gray-400 italic">{{
                                            t('tour.form.noGallery')
                                            }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Upload Progress -->
                        <div v-if="isSubmitting" class="mt-6">
                            <div class="flex justify-between mb-2 text-sm font-medium">
                                <span>{{ t('common.processing') }}</span>
                            </div>
                            <el-progress :percentage="100" status="success" :stroke-width="10" indeterminate striped
                                striped-flow />
                        </div>
                    </div>
                </el-form>
            </div>
        </div>

        <template #footer>
            <div
                class="dialog-footer flex justify-between items-center px-6 py-4 border-t border-gray-100 dark:border-gray-800">
                <el-button @click="handleClose">{{ t('common.cancelBtn') }}</el-button>
                <div class="flex gap-3">
                    <el-button v-if="currentStep > 0" @click="prevStep" :icon="ArrowLeft">
                        {{ t('common.prevStep') }}
                    </el-button>
                    <el-button v-if="currentStep < 4" type="primary" @click="nextStep" :icon="ArrowRight">
                        {{ t('common.nextStep') }}
                    </el-button>
                    <el-button v-else type="success" @click="handleSubmit" :loading="isSubmitting" :icon="Check"
                        size="large">
                        {{ isEditMode ? 'Cập nhật Tour' : 'Tạo Tour' }}
                    </el-button>
                </div>
            </div>
        </template>
    </el-dialog>
</template>
<style scoped>
.create-tour-dialog :deep(.el-dialog__body) {
    padding: 0;
}

.animate-fade-in {
    animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
