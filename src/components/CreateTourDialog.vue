<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Upload, Picture, Delete, ArrowRight, ArrowLeft, Check } from '@element-plus/icons-vue';
import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { createTour, updateTour, type CreateTourDto, type Tour, validateTourForm } from '@/services/tourApi';

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
    set: (val) => emit('update:visible', val)
});

const queryClient = useQueryClient();

const isEditMode = computed(() => !!props.tourData);
const currentStep = ref(0);
const uploadProgress = ref(0);
const formRef = ref();

// Form Data
const formData = reactive<CreateTourDto>({
    title: '',
    type: '',
    price_usd: 0,
    duration: '',
    duration_days: 0,
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
const thumbnailInput = ref<HTMLInputElement | null>(null);
const galleryInput = ref<HTMLInputElement | null>(null);

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

// Methods
const resetForm = () => {
    Object.assign(formData, {
        title: '',
        type: '',
        price_usd: 0,
        duration: '',
        duration_days: 0,
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
    uploadProgress.value = 0;
};

// Watchers
watch(() => props.tourData, (newVal) => {
    if (newVal) {
        Object.assign(formData, newVal);
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
        thumbnailFile.value = file;
        thumbnailPreview.value = URL.createObjectURL(file);
    }
};

const removeThumbnail = () => {
    thumbnailFile.value = null;
    thumbnailPreview.value = '';
    if (thumbnailInput.value) thumbnailInput.value.value = '';
};

const handleGalleryChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files) {
        const newFiles = Array.from(input.files);
        const validFiles = newFiles.filter(file => file.size <= 5 * 1024 * 1024);

        if (validFiles.length < newFiles.length) {
            ElMessage.warning('Một số ảnh bị bỏ qua do lớn hơn 5MB');
        }

        galleryFiles.value = [...galleryFiles.value, ...validFiles];
        validFiles.forEach(file => {
            galleryPreviews.value.push(URL.createObjectURL(file));
        });
    }
};

const removeGalleryImage = (index: number) => {
    // Check if it's a new file or existing URL
    // Logic: If index < existing images length, it's existing. But wait, previews mix them?
    // Actually, let's simplify: galleryPreviews contains ALL images (existing + new).
    // But galleryFiles only contains NEW files.
    // This mixing logic is tricky.
    // Better approach: Keep previews separate or track them carefully.

    // For simplicity in this version:
    // If we remove an image, we need to know if it's from formData.images (string) or galleryFiles (File).

    // Let's assume galleryPreviews is purely for display and we rebuild it.
    // But wait, we need to remove from the source arrays.

    // Let's change strategy:
    // galleryPreviews will hold objects: { type: 'url' | 'file', url: string, file?: File }
    // But that requires changing state structure.

    // Simple fix:
    // We have formData.images (URLs) and galleryFiles (Files).
    // We can display them in two separate lists or one combined list.
    // In the template, I used one loop over galleryPreviews.

    // Let's just remove from the specific array.
    // If index < formData.images.length, remove from formData.images.
    // Else remove from galleryFiles (index - formData.images.length).

    // But wait, galleryPreviews was constructed by pushing new files.
    // So: existing URLs first, then new files.

    if (index < formData.images.length) {
        formData.images.splice(index, 1);
        galleryPreviews.value.splice(index, 1);
    } else {
        const fileIndex = index - formData.images.length;
        galleryFiles.value.splice(fileIndex, 1);
        galleryPreviews.value.splice(index, 1);
    }
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
const { mutate: createTourMutation, isPending: isCreating } = useMutation({
    mutationFn: async ({ formData, onProgress }: { formData: FormData; onProgress?: (event: any) => void }) => {
        return createTour(formData, onProgress);
    },
    onSuccess: () => {
        ElMessage.success('Tạo tour thành công!');
        queryClient.invalidateQueries({ queryKey: ['tours'] });
        emit('success');
        dialogVisible.value = false;
        resetForm();
    },
    onError: (error: any) => {
        console.error('Error creating tour:', error);
        ElMessage.error(error.message || 'Có lỗi xảy ra khi tạo tour');
    }
});

// Update Tour Mutation
const { mutate: updateTourMutation, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, formData, onProgress }: { id: string; formData: FormData; onProgress?: (event: any) => void }) => {
        return updateTour(id, formData, onProgress);
    },
    onSuccess: () => {
        ElMessage.success('Cập nhật tour thành công!');
        queryClient.invalidateQueries({ queryKey: ['tours'] });
        emit('success');
        dialogVisible.value = false;
        resetForm();
    },
    onError: (error: any) => {
        console.error('Error updating tour:', error);
        ElMessage.error(error.message || 'Có lỗi xảy ra khi cập nhật tour');
    }
});

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

    const submitData = new FormData();

    // Append basic fields
    Object.keys(formData).forEach(key => {
        if (key === 'images' || key === 'thumbnail') return; // Handle separately
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
    formData.images.forEach(url => {
        submitData.append('images', url);
    });
    // New images (Files)
    galleryFiles.value.forEach(file => {
        submitData.append('images', file);
    });

    const onProgress = (event: any) => {
        if (event.total) {
            uploadProgress.value = Math.round((event.loaded * 100) / event.total);
        }
    };

    if (isEditMode.value && props.tourData?.id) {
        updateTourMutation({ id: props.tourData.id, formData: submitData, onProgress });
    } else {
        createTourMutation({ formData: submitData, onProgress });
    }
};
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
                                <el-input v-model="formData.duration" placeholder="Ví dụ: 3 days 2 nights"
                                    size="large" />
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
                                <div><span class="font-semibold">Ảnh thumbnail:</span> {{ thumbnailFile ?
                                    thumbnailFile.name : (formData.thumbnail ? 'Đã có' : 'Chưa chọn') }}</div>
                                <div><span class="font-semibold">Ảnh gallery:</span> {{ galleryFiles.length }} ảnh mới,
                                    {{ formData.images.length }} ảnh cũ</div>
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
