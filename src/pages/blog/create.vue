<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const fileInput = ref<HTMLInputElement | null>(null)
const thumbnailPreview = ref<string | null>(null)

const post = reactive({
    title: '',
    content: '',
    thumbnail: null as File | null
})

const isPreview = ref(false)

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
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
        processFile(event.dataTransfer.files[0])
    }
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

const publishPost = () => {
    if (!post.title.trim()) {
        ElMessage.warning('Please enter a title')
        return
    }
    if (!post.content || post.content === '<p><br></p>') {
        ElMessage.warning('Please write some content')
        return
    }

    // Mock API call
    console.log('Publishing post:', {
        title: post.title,
        content: post.content,
        thumbnail: post.thumbnail ? 'File present' : 'No thumbnail'
    })

    ElMessage.success('Post published successfully! (Mock)')
}
</script>

<template>
    <div
        class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
        <div
            class="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-300">
            <!-- Header / Actions -->
            <div
                class="flex justify-between items-center px-8 py-6 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-50 transition-colors duration-300">
                <div class="flex items-center space-x-4">
                    <NuxtLink to="/blog"
                        class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors">
                        <i class='bx bx-arrow-back text-2xl'></i>
                    </NuxtLink>
                    <h1 class="text-xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
                        {{ isPreview ? 'Preview Post' : 'Create New Post' }}
                    </h1>
                </div>
                <div class="flex space-x-3">
                    <el-button class="dark:bg-gray-800 dark:text-white dark:hover:bg-transparent"
                        @click="togglePreview">
                        {{ isPreview ? 'Back to Edit' : 'Preview' }}
                    </el-button>
                    <el-button class="dark:bg-gray-800 dark:text-white dark:hover:bg-transparent">Save Draft</el-button>
                    <el-button color="#1A71C7" class="bg-#1A71C7 dark:bg-blue-600 dark:text-white" @click="publishPost">
                        Publish Post
                    </el-button>
                </div>
            </div>

            <div class="p-8 space-y-8">
                <!-- Editor Mode -->
                <div v-if="!isPreview" class="space-y-8">
                    <!-- Title Input -->
                    <div class="space-y-2">
                        <input v-model="post.title" type="text" placeholder="Article Title..."
                            class="w-full text-4xl font-bold text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 border-none focus:ring-0 p-0 bg-transparent transition-colors duration-300" />
                    </div>

                    <!-- Rich Text Editor -->
                    <div class="prose dark:(prose-invert bg-slate-900) max-w-none editor-container">
                        <ClientOnly>
                            <QuillEditor v-model:content="post.content" contentType="html" theme="snow" toolbar="full"
                                class="min-h-[400px] text-lg dark:text-gray-100" />
                        </ClientOnly>
                    </div>
                </div>

                <!-- Preview Mode -->
                <div v-else class="animate-fade-in">
                    <!-- Cover Image Preview -->
                    <div v-if="thumbnailPreview" class="w-full h-64 md:h-96 rounded-xl overflow-hidden mb-8">
                        <img :src="thumbnailPreview" class="w-full h-full object-cover" alt="Cover Image" />
                    </div>

                    <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-8">{{ post.title || 'Untitled Post'
                        }}</h1>
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
    border-top: none;
    border-left: none;
    border-right: none;
    /* border-bottom: 1px solid #e5e7eb; */
    position: sticky;
    top: 0;
    z-index: 10;
    padding: 12px 0;
    transition: background-color 0.3s, border-color 0.3s;
}

:global(.dark) :deep(.ql-toolbar.ql-snow) {
    background-color: #1f2937;
    border-bottom-color: #374151;
}

:global(.dark) :deep(.ql-toolbar.ql-snow .ql-stroke) {
    stroke: #9ca3af;
    /* gray-400 */
}

:global(.dark) :deep(.ql-toolbar.ql-snow .ql-fill) {
    fill: #9ca3af;
}

:global(.dark) :deep(.ql-toolbar.ql-snow .ql-picker) {
    color: #9ca3af;
}

:deep(.ql-container.ql-snow) {
    border: none;
    font-family: inherit;
}

:deep(.ql-editor) {
    min-height: 400px;
    font-size: 1.125rem;
    line-height: 1.75;
    padding: 1rem 0;
}

:global(.dark) :deep(.ql-editor.ql-blank::before) {
    color: #4b5563;
    /* gray-600 */
}

/* Element Plus overrides */
.el-button {
    font-weight: 500;
    border-radius: 8px;
    padding: 10px 20px;
    height: auto;
}

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
