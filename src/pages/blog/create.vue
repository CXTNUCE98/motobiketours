<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const fileInput = ref<HTMLInputElement | null>(null)
const thumbnailPreview = ref<string | null>(null)

// Language options
const languages = [
    { label: 'English', value: 'en' },
    { label: 'Tiếng Việt', value: 'vi' },
    { label: '中文', value: 'zh' },
    { label: '日本語', value: 'ja' },
    { label: '한국어', value: 'ko' },
]

const post = reactive({
    title: '',
    language: '',
    tags: [] as string[],
    shortDescription: '',
    content: '',
    thumbnail: null as File | null
})

const isPreview = ref(false)
const editorLoaded = ref(false)

// Lazy load editor when component mounts
onMounted(() => {
    editorLoaded.value = true
})

const togglePreview = () => {
    isPreview.value = !isPreview.value
}

const triggerFileInput = () => {
    fileInput.value?.click()
}

const handleFileChange = (event: Event) => {
    const input = event.target as HTMLInputElement
    if (input.files && input.files[0]) {
        processFile(input.files[0])
    }
}

const handleDrop = (event: DragEvent) => {
    event.preventDefault()
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
        processFile(event.dataTransfer.files[0])
    }
}

const handleDragOver = (event: DragEvent) => {
    event.preventDefault()
}

const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
        ElMessage.error('Please upload an image file')
        return
    }

    post.thumbnail = file
    const reader = new FileReader()
    reader.onload = (e) => {
        thumbnailPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
}

const removeThumbnail = () => {
    post.thumbnail = null
    thumbnailPreview.value = null
    if (fileInput.value) {
        fileInput.value.value = ''
    }
}

const saveDraft = () => {
    ElMessage.success('Draft saved successfully! (Mock)')
}

const publishPost = () => {
    if (!post.title.trim()) {
        ElMessage.warning('Please enter post name')
        return
    }
    if (!post.language) {
        ElMessage.warning('Please select a language')
        return
    }
    if (!post.shortDescription.trim()) {
        ElMessage.warning('Please enter short description')
        return
    }
    if (!post.content || post.content === '<p><br></p>') {
        ElMessage.warning('Please write some content')
        return
    }

    // Mock API call
    console.log('Publishing post:', {
        title: post.title,
        language: post.language,
        tags: post.tags,
        shortDescription: post.shortDescription,
        content: post.content,
        thumbnail: post.thumbnail ? 'File present' : 'No thumbnail'
    })

    ElMessage.success('Post published successfully! (Mock)')
}
</script>

<template>
    <div
        class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
        <div class="max-w-7xl mx-auto">
            <!-- Header / Actions -->
            <div
                class="flex justify-between items-center mb-6 px-6 py-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm transition-colors duration-300">
                <div class="flex items-center space-x-4">
                    <NuxtLink to="/blog"
                        class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors">
                        <i class='bx bx-arrow-back text-2xl'></i>
                    </NuxtLink>
                    <h1 class="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
                        {{ isPreview ? 'Preview Post' : 'Create New Post' }}
                    </h1>
                </div>
                <div class="flex space-x-3">
                    <el-button class="dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600" @click="togglePreview">
                        {{ isPreview ? 'Back to Edit' : 'Preview' }}
                    </el-button>
                    <el-button class="dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600" @click="saveDraft">
                        Save as draft
                    </el-button>
                    <el-button color="#FF6B35" class="bg-#FF6B35 text-white hover:bg-#FF5722" @click="publishPost">
                        Create
                    </el-button>
                </div>
            </div>

            <!-- Editor Mode -->
            <div v-if="!isPreview" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Left Column: Rich Text Editor (2/3 width) -->
                <div
                    class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-colors duration-300">
                    <div class="prose dark:prose-invert max-w-none editor-container">
                        <ClientOnly>
                            <QuillEditor v-if="editorLoaded" v-model:content="post.content" contentType="html"
                                theme="snow" toolbar="full" class="min-h-[500px] text-lg dark:text-gray-100"
                                placeholder="Type or paste your content here!" />
                            <div v-else
                                class="min-h-[500px] flex items-center dark:bg-slate-900 justify-center text-gray-400">
                                <i class='bx bx-loader-alt bx-spin text-4xl'></i>
                            </div>
                        </ClientOnly>
                    </div>
                    <div class="mt-4 text-sm text-gray-500 dark:text-gray-400 flex justify-between">
                        <span>Words: {{post.content ? post.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(w =>
                            w).length : 0}}</span>
                        <span>Characters: {{ post.content ? post.content.replace(/<[^>]*>/g, '').length : 0 }}</span>
                    </div>
                </div>

                <!-- Right Column: Metadata (1/3 width) -->
                <div class="space-y-6">
                    <!-- Post Name -->
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-colors duration-300">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Post name <span class="text-red-500">*</span>
                        </label>
                        <el-input v-model="post.title" placeholder="Input post name" maxlength="80" show-word-limit
                            class="w-full [&_.el-input\_\_wrapper]:dark:!bg-gray-800 [&_.el-input\_\_count-inner]:dark:!bg-gray-800" />
                    </div>

                    <!-- Language -->
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-colors duration-300">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Language <span class="text-red-500">*</span>
                        </label>
                        <el-select v-model="post.language" placeholder="Select language"
                            class="w-full [&_.el-select\_\_wrapper]:dark:!bg-gray-800">
                            <el-option v-for="lang in languages" :key="lang.value" :label="lang.label"
                                :value="lang.value" />
                        </el-select>
                    </div>

                    <!-- Tags -->
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-colors duration-300">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Tags <i class='bx bx-info-circle text-gray-400 cursor-help'
                                title="Add relevant tags to help readers find your post"></i>
                        </label>
                        <el-select v-model="post.tags" multiple filterable allow-create default-first-option
                            placeholder="Input tag" class="w-full [&_.el-select\_\_wrapper]:dark:!bg-gray-800"
                            maxlength="30">
                        </el-select>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">0/30</p>
                    </div>

                    <!-- Short Description -->
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-colors duration-300">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Short description <span class="text-red-500">*</span>
                        </label>
                        <el-input v-model="post.shortDescription" type="textarea" :rows="4"
                            class="[&_.el-textarea\_\_inner]:dark:!bg-gray-800 [&_.el-input\_\_count]:dark:!bg-gray-800"
                            placeholder="Input short description" maxlength="400" show-word-limit />
                    </div>

                    <!-- Thumbnail -->
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-colors duration-300">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Thumbnail
                        </label>
                        <div v-if="!thumbnailPreview" @click="triggerFileInput" @drop="handleDrop"
                            @dragover="handleDragOver"
                            class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                            <i class='bx bx-cloud-upload text-4xl text-gray-400 dark:text-gray-500 mb-2'></i>
                            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                <span class="text-blue-500 font-medium">Upload</span> or drag drop
                            </p>
                            <p class="text-xs text-gray-500 dark:text-gray-500">
                                Recommend size is 1280 × 720 pixels (≤ 2MB)
                            </p>
                        </div>
                        <div v-else class="relative">
                            <img :src="thumbnailPreview" class="w-full h-48 object-cover rounded-lg" alt="Thumbnail" />
                            <button @click="removeThumbnail"
                                class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors">
                                <i class='bx bx-x text-xl'></i>
                            </button>
                        </div>
                        <input ref="fileInput" type="file" accept="image/*" @change="handleFileChange" class="hidden" />
                    </div>
                </div>
            </div>

            <!-- Preview Mode -->
            <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 transition-colors duration-300">
                <!-- Cover Image Preview -->
                <div v-if="thumbnailPreview" class="w-full h-64 md:h-96 rounded-xl overflow-hidden mb-8">
                    <img :src="thumbnailPreview" class="w-full h-full object-cover" alt="Cover Image" />
                </div>

                <div class="max-w-4xl mx-auto">
                    <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {{ post.title || 'Untitled Post' }}
                    </h1>

                    <div class="flex items-center gap-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
                        <span v-if="post.language">
                            <i class='bx bx-world'></i> {{languages.find(l => l.value === post.language)?.label}}
                        </span>
                        <span v-if="post.tags.length">
                            <i class='bx bx-purchase-tag'></i> {{ post.tags.join(', ') }}
                        </span>
                    </div>

                    <p v-if="post.shortDescription" class="text-lg text-gray-600 dark:text-gray-300 mb-8 italic">
                        {{ post.shortDescription }}
                    </p>

                    <div class="prose dark:prose-invert max-w-none"
                        v-html="post.content || '<p class=\'text-gray-400 italic\'>No content yet...</p>'"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Customizing Quill Editor */
:deep(.ql-toolbar.ql-snow) {
    border: 1px solid #e5e7eb;
    border-radius: 8px 8px 0 0;
    padding: 12px;
    transition: background-color 0.3s, border-color 0.3s;
}

:global(.dark) :deep(.ql-toolbar.ql-snow) {
    background-color: #1f2937;
    border-color: #374151;
}

:global(.dark) :deep(.ql-toolbar.ql-snow .ql-stroke) {
    stroke: #9ca3af;
}

:global(.dark) :deep(.ql-toolbar.ql-snow .ql-fill) {
    fill: #9ca3af;
}

:global(.dark) :deep(.ql-toolbar.ql-snow .ql-picker) {
    color: #9ca3af;
}

:global(.dark) :deep(.ql-toolbar.ql-snow .ql-picker-options) {
    background-color: #1f2937;
    border-color: #374151;
}

:deep(.ql-container.ql-snow) {
    border: 1px solid #e5e7eb;
    border-top: none;
    border-radius: 0 0 8px 8px;
    font-family: inherit;
}

:global(.dark) :deep(.ql-container.ql-snow) {
    border-color: #374151;
    background-color: #111827;
}

:deep(.ql-editor) {
    min-height: 500px;
    font-size: 1.125rem;
    line-height: 1.75;
    padding: 1.5rem;
}

:global(.dark) :deep(.ql-editor) {
    color: #e5e7eb;
}

:global(.dark) :deep(.ql-editor.ql-blank::before) {
    color: #6b7280;
}

/* Element Plus Dark Mode Overrides */
:global(.dark) :deep(.el-input__wrapper) {
    background-color: #1f2937;
    box-shadow: 0 0 0 1px #374151 inset;
}

:global(.dark) :deep(.el-input__inner) {
    color: #e5e7eb;
}

:global(.dark) :deep(.el-textarea__inner) {
    background-color: #1f2937;
    border-color: #374151;
    color: #e5e7eb;
}

:global(.dark) :deep(.el-select__wrapper) {
    background-color: #1f2937;
    box-shadow: 0 0 0 1px #374151 inset;
}

:global(.dark) :deep(.el-select__placeholder) {
    color: #6b7280;
}

:global(.dark) :deep(.el-tag) {
    background-color: #374151;
    border-color: #4b5563;
    color: #e5e7eb;
}

/* Animations */
.animate-fade-in {
    animation: fadeIn 0.3s ease-in-out;
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
