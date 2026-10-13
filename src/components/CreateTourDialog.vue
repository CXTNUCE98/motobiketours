<script setup lang="ts">
import { ElMessage, ElMessageBox, type FormRules } from 'element-plus';
import { Delete, Loading, Menu, Plus } from '@element-plus/icons-vue';
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

// Thứ tự 5 bước, khớp với i18n `tour.steps.*`
const stepKeys = ['basicInfo', 'images', 'itinerary', 'details', 'confirm'] as const;

const durationOptions = [
    { label: '1 day', value: '1 day' },
    { label: '1 day 1 night', value: '1 day 1 night' },
    { label: '2 days 1 night', value: '2 days 1 night' },
    { label: '3 days 2 nights', value: '3 days 2 nights' },
    { label: '4 days 3 nights', value: '4 days 3 nights' },
    { label: '5 days 4 nights', value: '5 days 4 nights' },
    { label: '6 days 5 nights', value: '6 days 5 nights' }
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

const { data: vehicles } = useVehiclesQuery({ enabled: dialogVisible });
const { data: hotSpots } = useHotSpotsQuery(ref({}), { enabled: dialogVisible });

const addItineraryItem = () => {
    formData.itineraries.push({ hotSpotId: '', activityDescription: '', durationMinutes: 0 });
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
    type: [{ required: true, message: t('tour.validation.typeRequired'), trigger: 'change' }],
    priceUsd: [
        { required: true, message: t('tour.validation.priceRequired'), trigger: 'blur' },
        { type: 'number' as const, min: 1, message: t('tour.validation.priceMin'), trigger: 'blur' }
    ],
    duration: [{ required: true, message: t('tour.validation.durationRequired'), trigger: 'blur' }],
    departFrom: [{ required: true, message: t('tour.validation.departFromRequired'), trigger: 'blur' }],
    routes: [{ required: true, message: t('tour.validation.routesRequired'), trigger: 'blur' }],
    description: [
        { required: true, message: t('tour.validation.descriptionRequired'), trigger: 'blur' },
        { min: 10, message: t('tour.validation.descriptionMin'), trigger: 'blur' }
    ],
    content: [{ required: true, message: t('tour.validation.contentRequired'), trigger: 'blur' }]
};

// Helper function to check if URL is a blob URL
const isBlobURL = (url: string): boolean => url.startsWith('blob:');

// Cleanup function to revoke all object URLs
const cleanupObjectURLs = () => {
    if (thumbnailPreview.value && isBlobURL(thumbnailPreview.value)) {
        URL.revokeObjectURL(thumbnailPreview.value);
    }
    galleryPreviews.value.forEach((url: string) => {
        if (url && isBlobURL(url)) {
            URL.revokeObjectURL(url);
        }
    });
};

// Reset Form
const resetForm = () => {
    cleanupObjectURLs();
    Object.assign(formData, {
        title: '', type: [], priceUsd: 0, duration: '', durationRange: '', departFrom: '',
        routes: '', description: '', content: '', thumbnail: '', images: [], isFeatured: false,
        suggestedVehicleId: null, itineraries: [], discount: 0
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
        cleanupObjectURLs();
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
    const submitData = {
        ...formData,
        images: formData.images,
        itineraries: formData.itineraries.map((item: any) => ({
            hotSpotId: item.hotSpotId,
            activityDescription: item.activityDescription,
            durationMinutes: item.durationMinutes
        }))
    };
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

const optionsType = [
    { label: t('tour.types.Adventure'), value: 'Adventure' },
    { label: t('tour.types.Culture'), value: 'Culture' },
    { label: t('tour.types.Nature'), value: 'Nature' },
    { label: t('tour.types.Food'), value: 'Food' },
];

onBeforeUnmount(() => {
    cleanupObjectURLs();
});
</script>


<template>
    <el-dialog v-model="dialogVisible" :title="isEditMode ? t('tour.editTour') : t('tour.createNewTour')" width="90%"
        class="create-tour-dialog" :close-on-click-modal="false" destroy-on-close lock-scroll :align-center="true">
        <div class="ctd-body">
            <ol class="ctd-steps" role="list">
                <li v-for="(stepKey, idx) in stepKeys" :key="stepKey" class="ctd-steps__item"
                    :class="{ 'is-active': currentStep === idx, 'is-done': currentStep > idx }">
                    <span class="ctd-steps__num">{{ idx + 1 }}</span>
                    <span class="ctd-steps__label">{{ t(`tour.steps.${stepKey}`) }}</span>
                </li>
            </ol>

            <el-form ref="formRef" :model="formData" :rules="rules" label-position="top" class="ctd-form">
                <div v-show="currentStep === 0" class="ctd-grid-2">
                    <el-form-item :label="t('tour.form.title')" prop="title">
                        <el-input v-model="formData.title" :placeholder="t('tour.form.titlePlaceholder')" size="large" />
                    </el-form-item>
                    <el-form-item :label="t('tour.form.type')" prop="type">
                        <el-select v-model="formData.type" multiple clearable
                            :placeholder="t('tour.form.typePlaceholder')" size="large" class="ctd-full">
                            <el-option v-for="option in optionsType" :key="option.value" :label="option.label"
                                :value="option.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="t('tour.form.price')" prop="priceUsd">
                        <el-input-number v-model="formData.priceUsd" :min="0" :step="10" size="large" class="ctd-full" />
                    </el-form-item>
                    <el-form-item :label="t('tour.form.discount')" prop="discount">
                        <el-input-number v-model="formData.discount" :min="0" :max="100" :step="5" size="large"
                            class="ctd-full" />
                    </el-form-item>
                    <el-form-item :label="t('tour.form.duration')" prop="duration">
                        <el-select v-model="formData.duration" :placeholder="t('tour.form.durationPlaceholder')"
                            size="large" class="ctd-full" @change="handleUpdateDuration">
                            <el-option v-for="option in durationOptions" :key="option.value"
                                :label="t('tour.durationOptions.' + option.value.replace(/\s/g, '') as any)"
                                :value="option.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="t('tour.form.departFrom')" prop="departFrom">
                        <el-input v-model="formData.departFrom" :placeholder="t('tour.form.departFromPlaceholder')"
                            size="large" />
                    </el-form-item>
                    <el-form-item :label="t('tour.form.routes')" prop="routes" class="ctd-span-2">
                        <el-input v-model="formData.routes" :placeholder="t('tour.form.routesPlaceholder')"
                            size="large" />
                    </el-form-item>
                    <el-form-item :label="t('tour.form.featured')" class="ctd-span-2">
                        <el-switch v-model="formData.isFeatured" :active-text="t('common.yes')"
                            :inactive-text="t('common.no')" />
                    </el-form-item>
                </div>

                <div v-show="currentStep === 1" class="ctd-stack">
                    <section class="ctd-section">
                        <h3 class="ctd-section__title">{{ t('tour.form.thumbnail') }}</h3>
                        <div class="ctd-upload">
                            <div v-if="thumbnailPreview || isUploading" class="ctd-thumb">
                                <img v-if="thumbnailPreview" :src="thumbnailPreview" :class="{ 'is-uploading': isUploading }">
                                <div v-if="isUploading" class="ctd-thumb__loading">
                                    <el-icon class="is-loading"><Loading /></el-icon>
                                </div>
                                <el-button v-if="thumbnailPreview && !isUploading" type="danger" circle :icon="Delete"
                                    :aria-label="t('common.remove')" class="ctd-thumb__remove" @click="removeThumbnail" />
                            </div>
                            <div class="ctd-upload__action">
                                <input type="file" ref="thumbnailInput" accept="image/*" class="visually-hidden"
                                    @change="handleThumbnailChange">
                                <UiButton variant="outline" size="sm" :disabled="isUploading"
                                    @click="thumbnailInput?.click()">
                                    {{ t('common.chooseImage') }}
                                </UiButton>
                                <p class="ctd-upload__rule">{{ t('tour.form.imageRule') }}</p>
                            </div>
                        </div>
                    </section>

                    <section class="ctd-section">
                        <h3 class="ctd-section__title">{{ t('tour.form.gallery') }}</h3>
                        <div class="ctd-gallery">
                            <div v-for="(url, index) in galleryPreviews" :key="index" class="ctd-gallery__item">
                                <img :src="url">
                                <el-button type="danger" circle :icon="Delete" size="small"
                                    :aria-label="t('common.remove')" class="ctd-gallery__remove"
                                    @click="removeGalleryImage(index)" />
                            </div>
                            <div v-if="isUploading" class="ctd-gallery__loading">
                                <el-icon class="is-loading"><Loading /></el-icon>
                                <span>{{ t('common.uploading') }}</span>
                            </div>
                        </div>
                        <input type="file" ref="galleryInput" accept="image/*" multiple class="visually-hidden"
                            @change="handleGalleryChange">
                        <UiButton variant="outline" size="sm" :disabled="isUploading" @click="galleryInput?.click()">
                            {{ t('tour.form.addToGallery') }}
                        </UiButton>
                    </section>
                </div>

                <div v-show="currentStep === 2" class="ctd-stack">
                    <section class="ctd-section">
                        <h3 class="ctd-section__title">{{ t('tour.form.suggestedVehicle') }}</h3>
                        <el-form-item :label="t('tour.form.suggestedVehicle')" class="ctd-form-item--bare">
                            <el-select v-model="formData.suggestedVehicleId"
                                :placeholder="t('tour.form.suggestedVehiclePlaceholder')" size="large" class="ctd-full"
                                clearable>
                                <el-option v-for="v in vehicles" :key="v.id" :label="`${v.model} (${v.capacity} seats)`"
                                    :value="v.id" />
                            </el-select>
                        </el-form-item>
                    </section>

                    <section class="ctd-section">
                        <div class="ctd-section__head">
                            <h3 class="ctd-section__title">{{ t('tour.form.itineraryTitle') }}</h3>
                            <el-button type="primary" :icon="Plus" circle :aria-label="t('tour.form.addStop')"
                                @click="addItineraryItem" />
                        </div>

                        <draggable v-model="formData.itineraries" item-key="hotSpotId" handle=".ctd-drag-handle">
                            <template #item="{ element, index }">
                                <div class="ctd-itinerary-item">
                                    <span class="ctd-drag-handle" :aria-label="t('common.dragToReorder')">
                                        <el-icon><Menu /></el-icon>
                                    </span>
                                    <div class="ctd-itinerary-item__fields">
                                        <el-form-item :label="t('tour.form.hotSpot')" class="ctd-form-item--bare">
                                            <el-select v-model="element.hotSpotId" filterable
                                                :placeholder="t('tour.form.hotSpot')" class="ctd-full">
                                                <el-option v-for="spot in hotSpots" :key="spot.id" :label="spot.name"
                                                    :value="spot.id" />
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item :label="t('tour.form.durationMinutes')" class="ctd-form-item--bare">
                                            <el-input-number v-model="element.durationMinutes" :min="0" class="ctd-full" />
                                        </el-form-item>
                                        <el-form-item :label="t('tour.form.activity')"
                                            class="ctd-form-item--bare ctd-span-2">
                                            <el-input v-model="element.activityDescription"
                                                :placeholder="t('tour.form.activityPlaceholder')" />
                                        </el-form-item>
                                    </div>
                                    <el-button type="danger" :icon="Delete" circle plain :aria-label="t('common.remove')"
                                        class="ctd-itinerary-item__remove" @click="removeItineraryItem(index)" />
                                </div>
                            </template>
                        </draggable>

                        <p v-if="formData.itineraries.length === 0" class="ctd-empty">{{ t('tour.form.noStops') }}</p>
                        <UiButton v-else variant="outline" block @click="addItineraryItem">
                            + {{ t('tour.form.addStop') }}
                        </UiButton>
                    </section>
                </div>

                <div v-show="currentStep === 3" class="ctd-stack">
                    <el-form-item :label="t('tour.form.description')" prop="description" class="ctd-form-item--bare">
                        <el-input v-model="formData.description" type="textarea" :rows="3"
                            :placeholder="t('tour.form.descriptionPlaceholder')" />
                    </el-form-item>
                    <el-form-item :label="t('tour.form.content')" prop="content" class="ctd-form-item--bare">
                        <div class="ctd-editor">
                            <ClientOnly>
                                <QuillEditor v-model:content="formData.content" content-type="html" theme="snow"
                                    toolbar="full" />
                            </ClientOnly>
                        </div>
                    </el-form-item>
                </div>

                <div v-show="currentStep === 4" class="ctd-stack">
                    <section class="ctd-summary">
                        <h3 class="ctd-section__title">{{ t('tour.steps.confirmTitle') }}</h3>
                        <dl class="ctd-summary__grid">
                            <div>
                                <dt>{{ t('tour.form.title') }}</dt>
                                <dd>{{ formData.title }}</dd>
                            </div>
                            <div>
                                <dt>{{ t('tour.form.priceLabel') }}</dt>
                                <dd>{{ formatPrice(formData.priceUsd) }}</dd>
                            </div>
                            <div>
                                <dt>{{ t('tour.form.duration') }}</dt>
                                <dd>{{ formData.duration }}</dd>
                            </div>
                            <div>
                                <dt>{{ t('tour.form.type') }}</dt>
                                <dd>{{ formData.type.join(', ') }}</dd>
                            </div>
                            <div>
                                <dt>{{ t('tour.form.departFromLabel') }}</dt>
                                <dd>{{ formData.departFrom }}</dd>
                            </div>
                            <div>
                                <dt>{{ t('tour.form.vehicleLabel') }}</dt>
                                <dd>{{ vehicles?.find((v: any) => v.id === formData.suggestedVehicleId)?.model || t('common.no') }}</dd>
                            </div>
                            <div class="ctd-span-2">
                                <dt>{{ t('tour.form.itineraryLabel', { count: formData.itineraries.length }) }}</dt>
                                <dd>
                                    <ol class="ctd-summary__list">
                                        <li v-for="(item, idx) in formData.itineraries" :key="idx">
                                            {{ Number(idx) + 1 }}. {{ hotSpots?.find((s: any) => s.id === item.hotSpotId)?.name }}
                                            <span v-if="item.durationMinutes">({{ item.durationMinutes }} {{ t('hotSpots.minutes' as any) || 'phút' }})</span>
                                        </li>
                                    </ol>
                                </dd>
                            </div>
                            <div class="ctd-span-2">
                                <dt>{{ t('tour.form.thumbnailLabel') }}</dt>
                                <dd>
                                    <img v-if="thumbnailPreview" :src="thumbnailPreview" class="ctd-summary__thumb">
                                    <span v-else class="ctd-empty-inline">{{ t('tour.form.noThumbnail') }}</span>
                                </dd>
                            </div>
                            <div class="ctd-span-2">
                                <dt>{{ t('tour.form.galleryLabel', { count: galleryPreviews?.length }) }}</dt>
                                <dd>
                                    <div class="ctd-summary__gallery">
                                        <img v-for="(url, idx) in galleryPreviews" :key="idx" :src="url">
                                        <span v-if="galleryPreviews.length === 0" class="ctd-empty-inline">{{ t('tour.form.noGallery') }}</span>
                                    </div>
                                </dd>
                            </div>
                        </dl>

                        <div v-if="isSubmitting" class="ctd-progress">
                            <p>{{ t('common.processing') }}</p>
                            <el-progress :percentage="100" status="success" :stroke-width="6" indeterminate striped
                                striped-flow />
                        </div>
                    </section>
                </div>
            </el-form>
        </div>

        <template #footer>
            <div class="ctd-footer">
                <UiButton variant="ghost" @click="handleClose">{{ t('common.cancelBtn') }}</UiButton>
                <div class="ctd-footer__nav">
                    <UiButton v-if="currentStep > 0" variant="outline" @click="prevStep">
                        {{ t('common.prevStep') }}
                    </UiButton>
                    <UiButton v-if="currentStep < 4" @click="nextStep">{{ t('common.nextStep') }}</UiButton>
                    <UiButton v-else :disabled="isSubmitting" @click="handleSubmit">
                        {{ isSubmitting ? t('common.processing') : (isEditMode ? t('tour.updateBtn') : t('tour.createBtn')) }}
                    </UiButton>
                </div>
            </div>
        </template>
    </el-dialog>
</template>
<style scoped>
.create-tour-dialog :deep(.el-dialog__body) { padding: 0; }
.ctd-body { max-height: 70vh; padding: var(--space-6) var(--gutter); overflow-y: auto; }
.ctd-steps { display: flex; flex-wrap: wrap; gap: var(--space-5) var(--space-6); padding-bottom: var(--space-5); margin-bottom: var(--space-fluid-md); border-bottom: 1px solid var(--color-border-strong); }
.ctd-steps__item { display: flex; align-items: center; gap: var(--space-2); color: var(--color-text-muted); }
.ctd-steps__num { display: inline-flex; align-items: center; justify-content: center; width: 1.75rem; height: 1.75rem; border: 1px solid currentColor; border-radius: 50%; font-family: var(--font-serif); font-size: var(--text-sm); }
.ctd-steps__label { font-size: var(--text-sm); white-space: nowrap; }
.ctd-steps__item.is-active { color: var(--color-accent); font-weight: var(--weight-semibold); }
.ctd-steps__item.is-active .ctd-steps__num { background: var(--color-accent); border-color: var(--color-accent); color: var(--color-on-accent); }
.ctd-steps__item.is-done { color: var(--color-text); }
.ctd-grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr)); gap: 0 var(--space-5); }
.ctd-span-2 { grid-column: 1 / -1; }
.ctd-full { width: 100%; }
.ctd-stack { display: grid; gap: var(--space-fluid-md); }
.ctd-form-item--bare { margin-bottom: 0; }
.ctd-section { padding-top: var(--space-5); border-top: 1px solid var(--color-border); }
.ctd-section__head { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-4); }
.ctd-section__title { margin-bottom: var(--space-4); font-family: var(--font-serif); font-size: var(--text-xl); font-weight: var(--weight-regular); }
.ctd-section__head .ctd-section__title { margin-bottom: 0; }
.ctd-upload { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-6); padding: var(--space-5); border: 1px dashed var(--color-border); border-radius: var(--radius-lg); }
.ctd-thumb { position: relative; width: 12rem; aspect-ratio: 3 / 2; overflow: hidden; border-radius: var(--radius-md); background: var(--color-bg-subtle); }
.ctd-thumb img { width: 100%; height: 100%; object-fit: cover; }
.ctd-thumb img.is-uploading { opacity: 0.5; }
.ctd-thumb__loading { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: var(--color-accent); font-size: var(--text-2xl); }
.ctd-thumb__remove { position: absolute; top: var(--space-2); right: var(--space-2); }
.ctd-upload__action { flex: 1 1 14rem; }
.ctd-upload__rule { margin-top: var(--space-2); color: var(--color-text-muted); font-size: var(--text-sm); }
.ctd-gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 9rem), 1fr)); gap: var(--space-3); padding: var(--space-5); margin-bottom: var(--space-4); border: 1px dashed var(--color-border); border-radius: var(--radius-lg); }
.ctd-gallery__item { position: relative; aspect-ratio: 16 / 9; overflow: hidden; border-radius: var(--radius-sm); }
.ctd-gallery__item img { width: 100%; height: 100%; object-fit: cover; }
.ctd-gallery__remove { position: absolute; top: var(--space-1); right: var(--space-1); }
.ctd-gallery__loading { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: var(--space-1); aspect-ratio: 16 / 9; border: 1px dashed var(--color-border); border-radius: var(--radius-sm); color: var(--color-text-muted); font-size: var(--text-sm); }
.ctd-itinerary-item { display: flex; align-items: flex-start; gap: var(--space-4); padding-block: var(--space-4); border-bottom: 1px solid var(--color-border); }
.ctd-drag-handle { display: inline-flex; padding-top: var(--space-2); color: var(--color-text-muted); cursor: move; }
.ctd-itinerary-item__fields { display: grid; flex: 1; grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr)); gap: 0 var(--space-4); }
.ctd-itinerary-item__remove { margin-top: var(--space-2); }
.ctd-empty { padding-block: var(--space-6); color: var(--color-text-muted); text-align: center; }
.ctd-empty-inline { color: var(--color-text-muted); font-style: italic; }
.ctd-editor :deep(.ql-toolbar.ql-snow) { border: 1px solid var(--color-border); border-radius: var(--radius-md) var(--radius-md) 0 0; }
.ctd-editor :deep(.ql-container.ql-snow) { border: 1px solid var(--color-border); border-top: none; border-radius: 0 0 var(--radius-md) var(--radius-md); font-family: var(--font-sans); }
.ctd-editor :deep(.ql-editor) { min-height: 16rem; color: var(--color-text); }
.ctd-summary__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr)); gap: var(--space-5) var(--space-6); padding-top: var(--space-4); }
.ctd-summary__grid dt { color: var(--color-text-muted); font-size: var(--text-xs); font-weight: var(--weight-semibold); letter-spacing: var(--tracking-label); text-transform: uppercase; }
.ctd-summary__grid dd { margin-top: 0.375rem; }
.ctd-summary__list { display: grid; gap: var(--space-1); font-size: var(--text-sm); }
.ctd-summary__thumb { width: 10rem; aspect-ratio: 3 / 2; border-radius: var(--radius-sm); object-fit: cover; }
.ctd-summary__gallery { display: flex; flex-wrap: wrap; gap: var(--space-2); }
.ctd-summary__gallery img { width: 6rem; aspect-ratio: 3 / 2; border-radius: var(--radius-sm); object-fit: cover; }
.ctd-progress { margin-top: var(--space-6); }
.ctd-progress p { margin-bottom: var(--space-2); font-size: var(--text-sm); font-weight: var(--weight-medium); }
.ctd-footer { display: flex; align-items: center; justify-content: space-between; gap: var(--space-4); }
.ctd-footer__nav { display: flex; gap: var(--space-3); }
</style>
