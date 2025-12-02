<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick, onBeforeUnmount } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Upload, Picture, Delete, ArrowRight, ArrowLeft, Check } from '@element-plus/icons-vue';
import { type CreateTourDto, type Tour, validateTourForm } from '@/services/tourApi';
import { useUpdateTour, useCreateTour } from '~/composables/useTourQuery';

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
const uploadProgress = ref(0);
const formRef = ref();

const durationOptions = [
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
    '2 days 1 night': '1-3',
    '3 days 2 nights': '1-3',
    '4 days 3 nights': '4-7',
    '5 days 4 nights': '4-7',
    '6 days 5 nights': '4-7'
} as const;

// Form Data
const formData = reactive<CreateTourDto>({
    title: '',
    type: '',
    price_usd: 0,
    duration: '',
    duration_range: 0,
    depart_from: '',
    routes: '',
    description: '',
    content: '',
    thumbnail: '',
    images: [],
    is_featured: false
});

// File Handling
const thumbnailFile = ref<File | null>(null);
const thumbnailPreview = ref<string>('');
const galleryFiles = ref<File[]>([]);
const galleryPreviews = ref<string[]>([]);
const thumbnailInput = ref<any>(null);
const galleryInput = ref<any>(null);

// Validation Rules
const rules = {
    title: [
        { required: true, message: 'Vui lòng nhập tên tour', trigger: 'blur' },
        { min: 3, message: 'Tên tour phải có ít nhất 3 ký tự', trigger: 'blur' }
    ],
    type: [
        { required: true, message: 'Vui lòng chọn loại tour', trigger: 'change' }
    ],
    price_usd: [
        { required: true, message: 'Vui lòng nhập giá', trigger: 'blur' },
        {
            type: 'number',
            min: 1,
            message: 'Giá phải lớn hơn 0',
            trigger: 'blur'
        }
    ],
    duration: [
        { required: true, message: 'Vui lòng nhập thời gian', trigger: 'blur' }
    ],
    depart_from: [
        { required: true, message: 'Vui lòng nhập điểm khởi hành', trigger: 'blur' }
    ],
    routes: [
        { required: true, message: 'Vui lòng nhập lộ trình', trigger: 'blur' }
    ],
    description: [
        { required: true, message: 'Vui lòng nhập mô tả ngắn', trigger: 'blur' },
        { min: 10, message: 'Mô tả phải có ít nhất 10 ký tự', trigger: 'blur' }
    ],
    content: [
        { required: true, message: 'Vui lòng nhập nội dung chi tiết', trigger: 'blur' }
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
        type: '',
        price_usd: 0,
        duration: '',
        duration_range: 0,
        depart_from: '',
        routes: '',
        description: '',
        content: '',
        thumbnail: '',
        images: [],
        is_featured: false
    });
    thumbnailFile.value = null;
    thumbnailPreview.value = '';
    galleryFiles.value = [];
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

        const { id, created_at, ...tourDataWithoutMeta } = newVal;
        Object.assign(formData, tourDataWithoutMeta);
        thumbnailPreview.value = newVal.thumbnail;
        galleryPreviews.value = [...newVal.images];
    } else {
        resetForm();
    }
}, { immediate: true });

const handleThumbnailChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
        const file = input.files[0];
        if (file.size > 5 * 1024 * 1024) {
            ElMessage.error('Ảnh không được quá 5MB');
            return;
        }

        // Cleanup previous blob URL if exists
        if (thumbnailPreview.value && isBlobURL(thumbnailPreview.value)) {
            URL.revokeObjectURL(thumbnailPreview.value);
        }

        thumbnailFile.value = file;
        thumbnailPreview.value = URL.createObjectURL(file);
    }
};

const removeThumbnail = () => {
    // Cleanup blob URL before removing
    if (thumbnailPreview.value && isBlobURL(thumbnailPreview.value)) {
        URL.revokeObjectURL(thumbnailPreview.value);
    }

    thumbnailFile.value = null;
    thumbnailPreview.value = '';
    if (thumbnailInput.value) thumbnailInput.value.value = '';
};

const handleGalleryChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files) {
        const newFiles = Array.from(input.files);
        const validFiles = newFiles.filter(file => file.size <= 5 * 1024 * 1024);

        if (validFiles?.length < newFiles?.length) {
            ElMessage.warning('Một số ảnh bị bỏ qua do lớn hơn 5MB');
        }

        galleryFiles.value = [...galleryFiles.value, ...validFiles];
        validFiles.forEach(file => {
            galleryPreviews.value.push(URL.createObjectURL(file));
        });
    }
};

const removeGalleryImage = (index: number) => {
    // Get the URL to remove for cleanup
    const urlToRemove = galleryPreviews.value[index];
    if (!urlToRemove) return;

    // Check if it's a blob URL (new file) or server URL (existing image)
    const isNewFile = isBlobURL(urlToRemove);

    // Cleanup blob URL if it's a blob URL
    if (isNewFile) {
        URL.revokeObjectURL(urlToRemove);
    }

    // Determine which array to remove from based on whether it's a new file or existing image
    if (isNewFile) {
        // Removing new file (blob URL) - find the corresponding file index
        // Count how many blob URLs (new files) are before this index
        let blobUrlsBeforeIndex = 0;
        for (let i = 0; i < index; i++) {
            if (isBlobURL(galleryPreviews.value[i])) {
                blobUrlsBeforeIndex++;
            }
        }
        // The fileIndex is the number of blob URLs before this index
        const fileIndex = blobUrlsBeforeIndex;
        if (fileIndex >= 0 && fileIndex < galleryFiles.value.length) {
            galleryFiles.value.splice(fileIndex, 1);
        }
    } else {
        // Removing existing image (URL from server) - find and remove from formData.images by URL
        if (formData.images && Array.isArray(formData.images)) {
            // Find the index of the URL to remove
            const imageIndex = formData.images.findIndex((url: string) => url === urlToRemove);
            console.log('Found imageIndex:', imageIndex);

            if (imageIndex !== -1) {
                // Create a new array without the removed item to ensure reactivity
                formData.images = formData.images.filter((url: string, idx: number) => idx !== imageIndex);
            } else {
                console.warn('URL not found in formData.images');
            }
        }
    }

    // Always remove from galleryPreviews (it contains both types)
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
const { mutate: createTourMutation, isPending: isCreating } = useCreateTour();

// Update Tour Mutation
const { mutate: updateTourMutation, isPending: isUpdating } = useUpdateTour();

const isSubmitting = computed(() => isCreating.value || isUpdating.value);

const handleClose = () => {
    ElMessageBox.confirm('Bạn có chắc chắn muốn hủy? Các thay đổi sẽ không được lưu.', 'Cảnh báo', {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy',
        type: 'warning'
    }).then(() => {
        dialogVisible.value = false;
        resetForm();
    }).catch(() => { });
};

const handleSubmit = async () => {
    uploadProgress.value = 0;

    // Check if we have any files to upload
    const hasFiles = !!thumbnailFile.value || galleryFiles.value.length > 0;

    if (!hasFiles) {
        // Use JSON for update if no files are involved
        // This ensures that empty arrays (e.g. cleared images) are sent correctly
        const submitData = {
            ...formData,
            // Explicitly include images array (even if empty)
            images: formData.images
        };
        // Remove id and created_at if they exist in formData
        delete (submitData as any).id;
        delete (submitData as any).created_at;

        if (isEditMode.value && props.tourData?.id) {
            updateTourMutation({ id: props.tourData.id, data: submitData }, {
                onSuccess: () => {
                    ElMessage.success('Cập nhật tour thành công!');
                    emit('success');
                    dialogVisible.value = false;
                    resetForm();
                },
                onError: (error: any) => {
                    ElMessage.error(error.message || 'Có lỗi xảy ra khi cập nhật tour');
                }
            });
        } else {
            createTourMutation(submitData, {
                onSuccess: () => {
                    ElMessage.success('Tạo tour thành công!');
                    emit('success');
                    dialogVisible.value = false;
                    resetForm();
                },
                onError: (error: any) => {
                    ElMessage.error(error.message || 'Có lỗi xảy ra khi tạo tour');
                }
            });
        }
        return;
    }

    // Fallback to FormData if files exist
    const submitData = new FormData();

    // Append basic fields (exclude id and created_at)
    Object.keys(formData).forEach(key => {
        // Skip these fields
        if (key === 'images' || key === 'thumbnail' || key === 'id' || key === 'created_at') return;

        const value = formData[key as keyof CreateTourDto];
        if (value !== undefined && value !== null) {
            submitData.append(key, value.toString());
        }
    });

    // Append thumbnail
    if (thumbnailFile.value) {
        submitData.append('thumbnail', thumbnailFile.value);
    } else if (formData.thumbnail) {
        submitData.append('thumbnail', formData.thumbnail);
    }

    // Append images
    // Existing images (URLs)
    formData.images.forEach((url: string) => {
        submitData.append('images', url);
    });
    // New images (Files)
    galleryFiles.value.forEach((file: File) => {
        submitData.append('images', file);
    });

    const onProgress = (event: { loaded: number; total?: number }) => {
        if (event.total) {
            uploadProgress.value = Math.round((event.loaded * 100) / event.total);
        }
    };

    if (isEditMode.value && props.tourData?.id) {
        updateTourMutation({ id: props.tourData.id, data: submitData }, {
            onSuccess: () => {
                ElMessage.success('Cập nhật tour thành công!');
                emit('success');
                dialogVisible.value = false;
                resetForm();
            },
            onError: (error: any) => {
                ElMessage.error(error.message || 'Có lỗi xảy ra khi cập nhật tour');
            }
        });
    } else {
        createTourMutation(submitData, {
            onSuccess: () => {
                ElMessage.success('Tạo tour thành công!');
                emit('success');
                dialogVisible.value = false;
                resetForm();
            },
            onError: (error: any) => {
                ElMessage.error(error.message || 'Có lỗi xảy ra khi tạo tour');
            }
        });
    }
};

function handleUpdateDuration(value: string) {
    formData.duration_range = mapDurationRange[value] || 0;
}

// Cleanup on component unmount
onBeforeUnmount(() => {
    cleanupObjectURLs();
});
</script>


<template>
    <el-dialog v-model="dialogVisible" :title="isEditMode ? 'Chỉnh sửa Tour' : 'Tạo Tour Mới'" width="90%"
        class="create-tour-dialog" :close-on-click-modal="false" destroy-on-close>
        <div class="flex h-[80vh]">
            <!-- Steps Sidebar -->
            <div class="w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6">
                <el-steps direction="vertical" :active="currentStep" finish-status="success">
                    <el-step title="Thông tin cơ bản" description="Tên, giá, thời gian" />
                    <el-step title="Hình ảnh" description="Thumbnail & Gallery" />
                    <el-step title="Nội dung chi tiết" description="Mô tả, lịch trình" />
                    <el-step title="Xác nhận" description="Kiểm tra lại thông tin" />
                </el-steps>
            </div>

            <!-- Main Content -->
            <div class="flex-1 overflow-y-auto p-8 bg-white dark:bg-gray-900">
                <el-form ref="formRef" :model="formData" :rules="rules" label-position="top" class="max-w-4xl mx-auto">

                    <!-- Step 1: Basic Info -->
                    <div v-show="currentStep === 0" class="space-y-6 animate-fade-in">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <el-form-item label="Tên Tour" prop="title">
                                <el-input v-model="formData.title" placeholder="Nhập tên tour hấp dẫn..."
                                    size="large" />
                            </el-form-item>

                            <el-form-item label="Loại Tour" prop="type">
                                <el-select v-model="formData.type" placeholder="Chọn loại tour" size="large"
                                    class="w-full">
                                    <el-option label="Adventure" value="Adventure" />
                                    <el-option label="Culture" value="Culture" />
                                    <el-option label="Nature" value="Nature" />
                                    <el-option label="Food" value="Food" />
                                </el-select>
                            </el-form-item>

                            <el-form-item label="Giá (USD)" prop="price_usd">
                                <el-input-number v-model="formData.price_usd" :min="0" :step="10" size="large"
                                    class="w-full" />
                            </el-form-item>

                            <el-form-item label="Thời gian" prop="duration">
                                <!-- <el-input v-model="formData.duration" placeholder="Ví dụ: 3 days 2 nights"
                                    size="large" /> -->

                                <el-select v-model="formData.duration" placeholder="Chọn thời gian" size="large"
                                    class="w-full" @change="handleUpdateDuration">
                                    <el-option v-for="option in durationOptions" :key="option.value"
                                        :label="option.label" :value="option.value" />
                                </el-select>
                            </el-form-item>

                            <el-form-item label="Điểm khởi hành" prop="depart_from">
                                <el-input v-model="formData.depart_from" placeholder="Ví dụ: Ha Giang City"
                                    size="large" />
                            </el-form-item>

                            <el-form-item label="Lộ trình" prop="routes">
                                <el-input v-model="formData.routes" placeholder="Ví dụ: Ha Giang - Dong Van - Meo Vac"
                                    size="large" />
                            </el-form-item>
                        </div>

                        <el-form-item label="Tour nổi bật">
                            <el-switch v-model="formData.is_featured" active-text="Có" inactive-text="Không" />
                        </el-form-item>
                    </div>

                    <!-- Step 2: Images -->
                    <div v-show="currentStep === 1" class="space-y-8 animate-fade-in">
                        <!-- Thumbnail Upload -->
                        <div
                            class="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
                            <h3 class="text-lg font-semibold mb-4">Ảnh đại diện (Thumbnail)</h3>
                            <div class="flex items-center gap-6">
                                <div v-if="thumbnailPreview"
                                    class="relative w-48 h-32 rounded-lg overflow-hidden shadow-md group">
                                    <img :src="thumbnailPreview" class="w-full h-full object-cover" />
                                    <div
                                        class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <el-button type="danger" circle :icon="Delete" @click="removeThumbnail" />
                                    </div>
                                </div>
                                <div class="flex-1">
                                    <input type="file" ref="thumbnailInput" accept="image/*" class="hidden"
                                        @change="handleThumbnailChange" />
                                    <el-button type="primary" :icon="Upload" @click="$refs.thumbnailInput.click()">
                                        Chọn ảnh
                                    </el-button>
                                    <p class="mt-2 text-sm text-gray-500">Định dạng: JPG, PNG. Tối đa 5MB.</p>
                                </div>
                            </div>
                        </div>

                        <!-- Gallery Upload -->
                        <div
                            class="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
                            <h3 class="text-lg font-semibold mb-4">Thư viện ảnh (Gallery)</h3>
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
                            </div>
                            <input type="file" ref="galleryInput" accept="image/*" multiple class="hidden"
                                @change="handleGalleryChange" />
                            <el-button type="primary" plain :icon="Picture" @click="$refs.galleryInput.click()">
                                Thêm ảnh vào thư viện
                            </el-button>
                        </div>
                    </div>

                    <!-- Step 3: Content -->
                    <div v-show="currentStep === 2" class="space-y-6 animate-fade-in">
                        <el-form-item label="Mô tả ngắn" prop="description">
                            <el-input v-model="formData.description" type="textarea" :rows="3"
                                placeholder="Mô tả ngắn gọn về tour để hiển thị trên thẻ..." />
                        </el-form-item>

                        <el-form-item label="Nội dung chi tiết" prop="content">
                            <div class="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                                <ClientOnly>
                                    <QuillEditor v-model:content="formData.content" contentType="html" theme="snow"
                                        toolbar="full" style="height: 400px" />
                                </ClientOnly>
                            </div>
                        </el-form-item>
                    </div>

                    <!-- Step 4: Confirmation -->
                    <div v-show="currentStep === 3" class="space-y-6 animate-fade-in">
                        <div
                            class="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
                            <h3 class="text-xl font-bold text-blue-800 dark:text-blue-300 mb-4">Xác nhận thông tin</h3>
                            <div class="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                                <div><span class="font-semibold">Tên Tour:</span> {{ formData.title }}</div>
                                <div><span class="font-semibold">Giá:</span> ${{ formData.price_usd }}</div>
                                <div><span class="font-semibold">Thời gian:</span> {{ formData.duration }}</div>
                                <div><span class="font-semibold">Loại:</span> {{ formData.type }}</div>
                                <div><span class="font-semibold">Khởi hành:</span> {{ formData.depart_from }}</div>
                                <div class="col-span-2">
                                    <span class="font-semibold block mb-2">Ảnh thumbnail:</span>
                                    <div v-if="thumbnailPreview"
                                        class="w-40 h-24 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                        <img :src="thumbnailPreview" class="w-full h-full object-cover" />
                                    </div>
                                    <span v-else class="text-gray-400 italic">Chưa chọn ảnh</span>
                                </div>
                                <div class="col-span-2">
                                    <span class="font-semibold block mb-2">Ảnh gallery ({{ galleryPreviews?.length }}
                                        ảnh):</span>
                                    <div class="flex flex-wrap gap-3">
                                        <div v-for="(url, idx) in galleryPreviews" :key="idx"
                                            class="w-24 h-16 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                            <img :src="url" class="w-full h-full object-cover" />
                                        </div>
                                        <span v-if="galleryPreviews?.length === 0" class="text-gray-400 italic">Chưa có
                                            ảnh nào</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Upload Progress -->
                        <div v-if="isSubmitting" class="mt-6">
                            <div class="flex justify-between mb-2 text-sm font-medium">
                                <span>Đang xử lý...</span>
                                <span>{{ uploadProgress }}%</span>
                            </div>
                            <el-progress :percentage="uploadProgress" :status="uploadProgress === 100 ? 'success' : ''"
                                :stroke-width="10" striped striped-flow />
                        </div>
                    </div>
                </el-form>
            </div>
        </div>

        <template #footer>
            <div
                class="dialog-footer flex justify-between items-center px-6 py-4 border-t border-gray-100 dark:border-gray-800">
                <el-button @click="handleClose">Hủy bỏ</el-button>
                <div class="flex gap-3">
                    <el-button v-if="currentStep > 0" @click="prevStep" :icon="ArrowLeft">
                        Quay lại
                    </el-button>
                    <el-button v-if="currentStep < 3" type="primary" @click="nextStep" :icon="ArrowRight">
                        Tiếp theo
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
