<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useCreateBlogMutation, useUploadImageMutation } from '~/composables/useBlogMutation'
import { useAuth } from '~/composables/useAuth'

const countWords = (html: string) => {
    const text = html.replace(/<[^>]*>/g, ' ');
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

const validateBlogForm = (data: any) => {
    const errors = [];
    if (!data.title) errors.push('Title is required');
    if (!data.language) errors.push('Language is required');
    if (!data.category) errors.push('Category is required');
    if (!data.content) errors.push('Content is required');
    if (!data.shortDescription) errors.push('Short description is required');
    return errors;
};
import { logger } from '~/utils/logger'

const router = useRouter()
const { user } = useAuth()

const fileInput = ref<HTMLInputElement | null>(null)
const thumbnailPreview = ref<string | null>(null)
const thumbnailImageId = ref<string>('')
const quillEditorRef = ref<any>(null)

const { mutateAsync: uploadImageAsync } = useUploadImageMutation()
const { mutateAsync: createBlogAsync } = useCreateBlogMutation()

// Loading states
const uploadingThumbnail = ref(false)
const publishing = ref(false)
const savingDraft = ref(false)

// Language options
const languages = [
    { label: 'English', value: 'en' },
    { label: 'Tiếng Việt', value: 'vi' },
    // { label: '中文', value: 'zh' },
    // { label: '日本語', value: 'ja' },
    // { label: '한국어', value: 'ko' },
]

// Category options
const categories = [
    { label: 'Travel Tips', value: 'travel-tips' },
    { label: 'Destination', value: 'destination' },
    { label: 'Culture', value: 'culture' },
    { label: 'Food', value: 'food' },
    { label: 'Adventure', value: 'adventure' },
    { label: 'Guides', value: 'guides' },
]

const post = reactive({
    title: '',
    language: '',
    tags: [] as string[],
    shortDescription: '',
    content: '',
    category: '',
    thumbnail: null as File | null,
    author: {
        authId: user.value?.id || '',
        userName: user.value?.userName || '',
        avatar: user.value?.avatar || '',
    }
})

const isPreview = ref(false)
const editorLoaded = ref(false)

// Sanitized content for safe rendering
const sanitizedContent = computed(() => {
    const content = post?.content || '<p class=\'text-gray-400 italic\'>No content yet...</p>';
    return sanitizeHtmlForPreview(content);
})

// Lazy load editor when component mounts
onMounted(() => {
    editorLoaded.value = true
    // Setup Quill image handler after editor is loaded
    setTimeout(() => {
        setupQuillImageHandler()
    }, 1000)
})

// Setup Quill image upload handler
const setupQuillImageHandler = () => {
    if (!quillEditorRef.value) return

    const quill = quillEditorRef.value.getQuill?.()
    if (!quill) return

    const toolbar = quill.getModule('toolbar')
    if (toolbar) {
        toolbar.addHandler('image', handleQuillImageUpload)
    }
}

// Handle image upload in Quill editor
const handleQuillImageUpload = () => {
    const input = globalThis.document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()

    input.onchange = async () => {
        const file = input.files?.[0]
        if (!file) return

        try {
            ElMessage.info('Uploading image...')
            const result = await uploadImageAsync(file)

            // Insert image into editor using secureUrl for preview
            const quill = quillEditorRef.value?.getQuill?.()
            if (quill) {
                const range = quill.getSelection(true)
                quill.insertEmbed(range.index, 'image', result.secureUrl)
                quill.setSelection(range.index + 1)
            }

            ElMessage.success('Image uploaded successfully!')
        } catch (error: unknown) {
            logger.error('Image upload failed:', error)
            const message = error instanceof Error ? error.message : 'Failed to upload image';
            ElMessage.error(message)
        }
    }
}

const togglePreview = () => {
    isPreview.value = !isPreview.value
}

const triggerFileInput = () => {
    fileInput.value?.click()
}

const handleFileChange = async (event: Event) => {
    const input = event.target as HTMLInputElement
    if (input.files && input.files[0]) {
        await processFile(input.files[0])
    }
}

const handleDrop = async (event: DragEvent) => {
    event.preventDefault()
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
        await processFile(event.dataTransfer.files[0])
    }
}

const handleDragOver = (event: DragEvent) => {
    event.preventDefault()
}

const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
        ElMessage.error('Please upload an image file')
        return
    }

    // Upload thumbnail to server
    uploadingThumbnail.value = true
    try {
        const result = await uploadImageAsync(file)

        // Save imageId for blog creation
        thumbnailImageId.value = result.imageId

        // Show preview using secureUrl
        thumbnailPreview.value = result.secureUrl
        post.thumbnail = file

        ElMessage.success('Thumbnail uploaded successfully!')
    } catch (error: unknown) {
        logger.error('Thumbnail upload failed:', error)
        const message = error instanceof Error ? error.message : 'Failed to upload thumbnail';
        ElMessage.error(message)
        thumbnailImageId.value = ''
        thumbnailPreview.value = null
        post.thumbnail = null
    } finally {
        uploadingThumbnail.value = false
    }
}

const removeThumbnail = () => {
    post.thumbnail = null
    thumbnailPreview.value = null
    thumbnailImageId.value = ''
    if (fileInput.value) {
        fileInput.value.value = ''
    }
}

const saveDraft = async () => {
    await submitBlog('draft')
}

const publishPost = async () => {
    await submitBlog('waiting')
}

const submitBlog = async (status: 'draft' | 'waiting' | 'published') => {
    // Prepare form data
    const formData = {
        title: post.title,
        language: post.language,
        thumbnailImageId: thumbnailImageId.value,
        shortDescription: post.shortDescription,
        content: post.content,
        category: post.category,
        tags: post.tags,
        status: status,
        author: post.author
    }


    // Validate form
    const errors = validateBlogForm(formData)
    if (errors.length > 0) {
        ElMessage.warning(errors[0])
        return
    }

    // Set loading state
    if (status === 'draft') {
        savingDraft.value = true
    } else {
        publishing.value = true
    }

    try {
        // Count words
        const numWords = countWords(post.content)

        // Prepare blog data
        const blogData = {
            name: post.title,
            lang: post.language,
            thumbnail: thumbnailImageId.value,
            shortDescription: post.shortDescription,
            content: post.content,
            category: post.category,
            tags: post.tags,
            numWords: numWords,
            status: status,
            author: post.author
        }

        // Create blog
        const result = await createBlogAsync(blogData)

        // Show success message
        if (status === 'draft') {
            ElMessage.success('Draft saved successfully!')
        } else {
            ElMessage.success('Post published successfully!')
        }

        // Redirect to blog detail page
        setTimeout(() => {
            router.push(`/blog/${result.id}`)
        }, 1000)

    } catch (error: unknown) {
        logger.error('Failed to create blog:', error)
        const message = error instanceof Error ? error.message : 'Failed to create blog post';
        ElMessage.error(message)
    } finally {
        savingDraft.value = false
        publishing.value = false
    }
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
                    <el-button class="dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600" @click="saveDraft"
                        :loading="savingDraft" :disabled="publishing">
                        Save as draft
                    </el-button>
                    <el-button color="#FF6B35" class="bg-#FF6B35 text-white hover:bg-#FF5722" @click="publishPost"
                        :loading="publishing" :disabled="savingDraft">
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
                            <QuillEditor v-if="editorLoaded" ref="quillEditorRef" v-model:content="post.content"
                                contentType="html" theme="snow" toolbar="full"
                                class="min-h-[500px] text-lg dark:text-gray-100"
                                placeholder="Type or paste your content here!" />
                            <div v-else
                                class="min-h-[500px] flex items-center dark:bg-slate-900 justify-center text-gray-400">
                                <i class='bx bx-loader-alt bx-spin text-4xl'></i>
                            </div>
                        </ClientOnly>
                    </div>
                    <div class="mt-4 text-sm text-gray-500 dark:text-gray-400 flex justify-between">
                        <span>Words: {{post?.content ? post?.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(w =>
                            w).length : 0}}</span>
                        <span>Characters: {{ post?.content ? post?.content.replace(/<[^>]*>/g, '').length : 0 }}</span>
                    </div>
                </div>

                <!-- Right Column: Metadata (1/3 width) -->
                <div class="space-y-2 bg-white dark:bg-gray-800">
                    <!-- Post Name -->
                    <div class="p-2 transition-colors duration-300">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Post name <span class="text-red-500">*</span>
                        </label>
                        <el-input v-model="post.title" placeholder="Input post name" maxlength="80" show-word-limit
                            class="w-full [&_.el-input\_\_wrapper]:dark:!bg-gray-800 [&_.el-input\_\_count-inner]:dark:!bg-gray-800" />
                    </div>

                    <!-- Language -->
                    <div class="p-2 transition-colors duration-300">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Language <span class="text-red-500">*</span>
                        </label>
                        <el-select v-model="post.language" placeholder="Select language"
                            class="w-full [&_.el-select\_\_wrapper]:dark:!bg-gray-800">
                            <el-option v-for="lang in languages" :key="lang.value" :label="lang.label"
                                :value="lang.value" />
                        </el-select>
                    </div>
                    <!-- Category -->
                    <div class="p-2 transition-colors duration-300">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Category <span class="text-red-500">*</span>
                        </label>
                        <el-select v-model="post.category" placeholder="Select category"
                            class="w-full [&_.el-select\_\_wrapper]:dark:!bg-gray-800">
                            <el-option v-for="category in categories" :key="category.value" :label="category.label"
                                :value="category.value" />
                        </el-select>
                    </div>

                    <!-- Tags -->
                    <div class="p-2 transition-colors duration-300">
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
                    <div class="p-2 transition-colors duration-300">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Short description <span class="text-red-500">*</span>
                        </label>
                        <el-input v-model="post.shortDescription" type="textarea" :rows="4"
                            class="[&_.el-textarea\_\_inner]:dark:!bg-gray-800 [&_.el-input\_\_count]:dark:!bg-gray-800"
                            placeholder="Input short description" maxlength="400" show-word-limit />
                    </div>

                    <!-- Thumbnail -->
                    <div class="p-2 transition-colors duration-300">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Thumbnail
                        </label>
                        <div v-if="!thumbnailPreview" @click="triggerFileInput" @drop="handleDrop"
                            @dragover="handleDragOver"
                            class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
                            :class="{ 'opacity-50 pointer-events-none': uploadingThumbnail }">
                            <i class='bx text-4xl text-gray-400 dark:text-gray-500 mb-2'
                                :class="uploadingThumbnail ? 'bx-loader-alt bx-spin' : 'bx-cloud-upload'"></i>
                            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                <span class="text-blue-500 font-medium">{{ uploadingThumbnail ? 'Uploading...' :
                                    'Upload' }}</span> {{ uploadingThumbnail ? '' : 'or drag drop' }}
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
                        {{ post?.title || 'Untitled Post' }}
                    </h1>

                    <div class="flex items-center gap-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
                        <span v-if="post?.language">
                            <i class='bx bx-world'></i> {{languages.find(l => l.value === post?.language)?.label}}
                        </span>
                        <span v-if="post?.tags?.length">
                            <i class='bx bx-purchase-tag'></i> {{ post?.tags.join(', ') }}
                        </span>
                    </div>

                    <p v-if="post?.shortDescription" class="text-lg text-gray-600 dark:text-gray-300 mb-8 italic">
                        {{ post?.shortDescription }}
                    </p>

                    <div class="prose dark:prose-invert max-w-none" v-html="sanitizedContent"></div>
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
