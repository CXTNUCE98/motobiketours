<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCreateBlogMutation } from '~/composables/useBlogMutation'
import { useUploadMutation } from '~/composables/useUploadMutation'
import { logger } from '~/utils/logger'

definePageMeta({
    middleware: ['auth'],
})

const router = useRouter()
const { t } = useI18n()
const { user } = useAuth()

const countWords = (html: string) => {
    const text = html.replace(/<[^>]*>/g, ' ');
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

const validateBlogForm = (data: any) => {
    const errors = [];
    if (!data.title) errors.push(t('blog.editor.validation.titleRequired'));
    if (!data.language) errors.push(t('blog.editor.validation.languageRequired'));
    if (!data.category) errors.push(t('blog.editor.validation.categoryRequired'));
    if (!data.content) errors.push(t('blog.editor.validation.contentRequired'));
    if (!data.shortDescription) errors.push(t('blog.editor.validation.shortDescriptionRequired'));
    return errors;
};

const fileInput = ref<HTMLInputElement | null>(null)
const thumbnailPreview = ref<string | null>(null)
const thumbnailImageId = ref<string>('')
const quillEditorRef = ref<any>(null)

const { mutateAsync: uploadImageAsync } = useUploadMutation()
const { mutateAsync: createBlogAsync } = useCreateBlogMutation()

// Loading states
const uploadingThumbnail = ref(false)
const publishing = ref(false)
const savingDraft = ref(false)

// Language options
const languages = computed(() => [
    { label: t('blog.editor.langEn'), value: 'en' },
    { label: t('blog.editor.langVi'), value: 'vi' },
])

// Category options (khớp với bộ lọc trang danh sách blog)
const categories = computed(() => [
    { label: t('blog.type.travelTips'), value: 'travel-tips' },
    { label: t('blog.type.destination'), value: 'destination' },
    { label: t('blog.type.culture'), value: 'culture' },
    { label: t('blog.type.food'), value: 'food' },
    { label: t('blog.type.adventure'), value: 'adventure' },
    { label: t('blog.type.guides'), value: 'guides' },
])

// Thẻ phổ biến gợi ý nhanh (giống trang danh sách blog); người dùng vẫn có thể thêm thẻ tự do
const popularTags = ['Motorbike', 'Vietnam', 'Food', 'Culture', 'Adventure', 'Tips', 'Routes', 'Ha Giang', 'Safety']
const customTagInput = ref('')

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

const toggleTag = (tag: string) => {
    const idx = post.tags.indexOf(tag)
    if (idx >= 0) post.tags.splice(idx, 1)
    else post.tags.push(tag)
}

const removeTag = (tag: string) => {
    const idx = post.tags.indexOf(tag)
    if (idx >= 0) post.tags.splice(idx, 1)
}

const addCustomTag = () => {
    const tag = customTagInput.value.trim()
    if (tag && !post.tags.includes(tag)) post.tags.push(tag)
    customTagInput.value = ''
}

const isPreview = ref(false)
const editorLoaded = ref(false)

const wordCount = computed(() => post.content ? post.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w).length : 0)
const charCount = computed(() => post.content ? post.content.replace(/<[^>]*>/g, '').length : 0)

// Sanitized content for safe rendering
const sanitizedContent = computed(() => {
    const content = post?.content || `<p>${t('blog.editor.noContent')}</p>`;
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
            ElMessage.info(t('blog.editor.message.uploadingImage'))
            const result = await uploadImageAsync({ file, folder: 'blog' })

            // Insert image into editor using secureUrl for preview
            const quill = quillEditorRef.value?.getQuill?.()
            if (quill) {
                const range = quill.getSelection(true)
                quill.insertEmbed(range.index, 'image', result.url)
                quill.setSelection(range.index + 1)
            }

            ElMessage.success(t('blog.editor.message.uploadSuccess'))
        } catch (error: unknown) {
            logger.error('Image upload failed:', error)
            ElMessage.error(t('blog.editor.message.uploadError'))
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
        ElMessage.error(t('blog.editor.message.imageOnly'))
        return
    }

    // Upload thumbnail to server
    uploadingThumbnail.value = true
    try {
        const result = await uploadImageAsync({ file, folder: 'blog' })

        // Save imageId for blog creation
        thumbnailImageId.value = result.publicId

        // Show preview using secureUrl
        thumbnailPreview.value = result.url
        post.thumbnail = file

        ElMessage.success(t('blog.editor.message.thumbnailSuccess'))
    } catch (error: unknown) {
        logger.error('Thumbnail upload failed:', error)
        ElMessage.error(t('blog.editor.message.uploadError'))
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
            ElMessage.success(t('blog.editor.message.draftSaved'))
        } else {
            ElMessage.success(t('blog.editor.message.published'))
        }

        // Redirect to blog detail page
        setTimeout(() => {
            router.push(`/blog/${result.id}`)
        }, 1000)

    } catch (error: unknown) {
        logger.error('Failed to create blog:', error)
        ElMessage.error(t('blog.editor.message.createError'))
    } finally {
        savingDraft.value = false
        publishing.value = false
    }
}
</script>

<template>
    <div class="create-blog">
        <template v-if="user">
            <header class="shell create-blog__head">
                <NuxtLink to="/blog" class="create-blog__back">{{ t('blog.detail.backToBlog') }}</NuxtLink>
                <div class="create-blog__head-row">
                    <h1 class="create-blog__title">
                        {{ isPreview ? t('blog.editor.titlePreview') : t('blog.editor.titleCreate') }}
                    </h1>
                    <div class="create-blog__actions">
                        <UiButton variant="outline" size="sm" @click="togglePreview">
                            {{ isPreview ? t('blog.editor.backToEdit') : t('blog.editor.preview') }}
                        </UiButton>
                        <UiButton variant="outline" size="sm" :disabled="publishing" @click="saveDraft">
                            {{ savingDraft ? t('blog.editor.savingDraft') : t('blog.editor.saveDraft') }}
                        </UiButton>
                        <UiButton size="sm" :disabled="savingDraft" @click="publishPost">
                            {{ publishing ? t('blog.editor.publishing') : t('blog.editor.publish') }}
                        </UiButton>
                    </div>
                </div>
            </header>

            <!-- Editor Mode -->
            <div v-if="!isPreview" class="shell create-blog__layout">
                <div class="create-blog__editor-col">
                    <div class="create-blog__editor">
                        <ClientOnly>
                            <QuillEditor v-if="editorLoaded" ref="quillEditorRef" v-model:content="post.content"
                                content-type="html" theme="snow" toolbar="full"
                                :placeholder="t('blog.editor.contentPlaceholder')" />
                            <div v-else class="create-blog__editor-loading">{{ t('common.loadingData') }}</div>
                        </ClientOnly>
                    </div>
                    <p class="create-blog__counts">
                        <span>{{ t('blog.editor.wordsCount', { count: wordCount }) }}</span>
                        <span>{{ t('blog.editor.charsCount', { count: charCount }) }}</span>
                    </p>
                </div>

                <div class="create-blog__meta-col">
                    <UiField :label="t('blog.editor.postNameLabel')">
                        <template #default="{ id }">
                            <input :id="id" v-model="post.title" type="text" class="ui-control" maxlength="80"
                                :placeholder="t('blog.editor.postNamePlaceholder')">
                        </template>
                    </UiField>
                    <p class="create-blog__counter">{{ post.title.length }}/80</p>

                    <UiField :label="t('blog.editor.languageLabel')">
                        <template #default="{ id }">
                            <select :id="id" v-model="post.language" class="ui-control">
                                <option value="" disabled>{{ t('blog.editor.languagePlaceholder') }}</option>
                                <option v-for="lang in languages" :key="lang.value" :value="lang.value">
                                    {{ lang.label }}
                                </option>
                            </select>
                        </template>
                    </UiField>

                    <div class="create-blog__field">
                        <p class="create-blog__label">{{ t('blog.editor.categoryLabel') }}</p>
                        <div class="create-blog__chips" role="group" :aria-label="t('blog.editor.categoryLabel')">
                            <UiChip v-for="cat in categories" :key="cat.value" :active="post.category === cat.value"
                                @click="post.category = cat.value">
                                {{ cat.label }}
                            </UiChip>
                        </div>
                    </div>

                    <div class="create-blog__field">
                        <p class="create-blog__label">{{ t('blog.editor.tagsLabel') }}</p>
                        <p class="create-blog__hint">{{ t('blog.editor.tagsHint') }}</p>
                        <div class="create-blog__chips" role="group" :aria-label="t('blog.editor.tagsLabel')">
                            <UiChip v-for="tag in post.tags" :key="`sel-${tag}`" active @click="removeTag(tag)">
                                {{ tag }} ×
                            </UiChip>
                            <UiChip v-for="tag in popularTags.filter((pt) => !post.tags.includes(pt))" :key="`pop-${tag}`"
                                @click="toggleTag(tag)">
                                {{ tag }}
                            </UiChip>
                        </div>
                        <form class="create-blog__tag-form" @submit.prevent="addCustomTag">
                            <label class="visually-hidden" for="custom-tag">{{ t('blog.editor.tagsPlaceholder') }}</label>
                            <input id="custom-tag" v-model="customTagInput" type="text" class="ui-control"
                                :placeholder="t('blog.editor.tagsPlaceholder')">
                            <UiButton type="submit" variant="outline" size="sm">{{ t('blog.editor.addTag') }}</UiButton>
                        </form>
                    </div>

                    <UiField :label="t('blog.editor.shortDescriptionLabel')">
                        <template #default="{ id }">
                            <textarea :id="id" v-model="post.shortDescription" class="ui-control" rows="4"
                                maxlength="400" :placeholder="t('blog.editor.shortDescriptionPlaceholder')"></textarea>
                        </template>
                    </UiField>
                    <p class="create-blog__counter">{{ post.shortDescription.length }}/400</p>

                    <div class="create-blog__field">
                        <p class="create-blog__label">{{ t('blog.editor.thumbnailLabel') }}</p>
                        <div v-if="!thumbnailPreview" class="create-blog__dropzone"
                            :class="{ 'is-uploading': uploadingThumbnail }" role="button" tabindex="0"
                            @click="triggerFileInput" @keydown.enter="triggerFileInput" @drop="handleDrop"
                            @dragover="handleDragOver">
                            <p class="create-blog__dropzone-label">
                                <span>{{ uploadingThumbnail ? t('blog.editor.thumbnailUploading') : t('blog.editor.thumbnailUpload') }}</span>
                                <template v-if="!uploadingThumbnail"> {{ t('blog.editor.thumbnailDrag') }}</template>
                            </p>
                            <p class="create-blog__dropzone-rule">{{ t('blog.editor.thumbnailRule') }}</p>
                        </div>
                        <div v-else class="create-blog__thumb-preview">
                            <img :src="thumbnailPreview" :alt="t('blog.editor.thumbnailLabel')">
                            <button type="button" class="create-blog__thumb-remove"
                                :aria-label="t('blog.editor.removeThumbnail')" @click="removeThumbnail">×</button>
                        </div>
                        <input ref="fileInput" type="file" accept="image/*" class="visually-hidden"
                            @change="handleFileChange">
                    </div>
                </div>
            </div>

            <!-- Preview Mode -->
            <div v-else class="shell create-blog__preview">
                <div v-if="thumbnailPreview" class="create-blog__preview-cover">
                    <img :src="thumbnailPreview" :alt="post.title">
                </div>

                <div class="create-blog__preview-measure">
                    <h2 class="create-blog__preview-title">{{ post.title || t('blog.editor.untitledPost') }}</h2>

                    <p v-if="post.language || post.tags.length" class="create-blog__preview-meta">
                        <span v-if="post.language">{{ languages.find((l) => l.value === post.language)?.label }}</span>
                        <span v-if="post.tags.length">{{ post.tags.join(', ') }}</span>
                    </p>

                    <p v-if="post.shortDescription" class="create-blog__preview-lead">{{ post.shortDescription }}</p>

                    <div class="prose" v-html="sanitizedContent" />
                </div>
            </div>
        </template>

        <div v-else class="shell create-blog__login">
            <UiEmptyState :title="t('blog.editor.loginRequiredTitle')" :description="t('blog.editor.loginRequiredDesc')">
                <UiButton to="/">{{ t('blog.detail.backToBlog') }}</UiButton>
            </UiEmptyState>
        </div>
    </div>
</template>

<style scoped>
.create-blog__head {
    padding-top: var(--space-fluid-md);
    padding-bottom: var(--space-5);
    margin-bottom: var(--space-fluid-lg);
    border-bottom: 1px solid var(--color-border-strong);
}

.create-blog__back {
    display: inline-block;
    margin-bottom: var(--space-4);
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    text-decoration: underline;
    text-decoration-color: var(--color-accent);
    text-underline-offset: 0.3em;
}

.create-blog__head-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
}

.create-blog__title {
    font-family: var(--font-serif);
    font-size: var(--text-h3);
    font-weight: var(--weight-regular);
}

.create-blog__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
}

.create-blog__layout {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));
    gap: var(--space-fluid-xl);
    align-items: start;
    padding-bottom: var(--section-space);
}

@media (min-width: 64rem) {
    .create-blog__layout {
        grid-template-columns: 2fr 1fr;
    }
}

.create-blog__editor :deep(.ql-toolbar.ql-snow) {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md) var(--radius-md) 0 0;
}

.create-blog__editor :deep(.ql-container.ql-snow) {
    border: 1px solid var(--color-border);
    border-top: none;
    border-radius: 0 0 var(--radius-md) var(--radius-md);
    font-family: var(--font-sans);
}

.create-blog__editor :deep(.ql-editor) {
    min-height: 24rem;
    padding: var(--space-5);
    color: var(--color-text);
    font-size: var(--text-base);
    line-height: var(--leading-body);
}

.create-blog__editor :deep(.ql-editor.ql-blank::before) {
    color: var(--color-text-muted);
    font-style: normal;
}

.create-blog__editor :deep(.ql-stroke) {
    stroke: var(--color-text-muted);
}

.create-blog__editor :deep(.ql-fill) {
    fill: var(--color-text-muted);
}

.create-blog__editor :deep(.ql-picker) {
    color: var(--color-text-muted);
}

.create-blog__editor-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 24rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    color: var(--color-text-muted);
}

.create-blog__counts {
    display: flex;
    justify-content: space-between;
    margin-top: var(--space-3);
    color: var(--color-text-muted);
    font-size: var(--text-sm);
}

.create-blog__meta-col {
    display: grid;
    gap: var(--space-5);
    align-content: start;
}

.create-blog__counter {
    margin-top: calc(var(--space-3) * -1);
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    text-align: right;
}

.create-blog__field {
    display: grid;
    gap: var(--space-2);
}

.create-blog__label {
    color: var(--color-text-muted);
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
}

.create-blog__hint {
    margin-top: calc(var(--space-2) * -1);
    color: var(--color-text-muted);
    font-size: var(--text-sm);
}

.create-blog__chips {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
}

.create-blog__tag-form {
    display: flex;
    gap: var(--space-2);
    margin-top: var(--space-2);
}

.create-blog__tag-form .ui-control {
    min-height: 2.5rem;
}

.create-blog__dropzone {
    padding: var(--space-8) var(--space-5);
    border: 1px dashed var(--color-border);
    border-radius: var(--radius-lg);
    cursor: pointer;
    text-align: center;
    transition: border-color var(--transition-base);
}

.create-blog__dropzone:hover,
.create-blog__dropzone:focus-visible {
    border-color: var(--color-accent);
}

.create-blog__dropzone:focus-visible {
    outline: var(--focus-ring);
    outline-offset: 2px;
}

.create-blog__dropzone.is-uploading {
    opacity: 0.6;
    pointer-events: none;
}

.create-blog__dropzone-label span {
    color: var(--color-accent);
    font-weight: var(--weight-medium);
}

.create-blog__dropzone-rule {
    margin-top: var(--space-2);
    color: var(--color-text-muted);
    font-size: var(--text-sm);
}

.create-blog__thumb-preview {
    position: relative;
    border-radius: var(--radius-lg);
    overflow: hidden;
}

.create-blog__thumb-preview img {
    display: block;
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
}

.create-blog__thumb-remove {
    position: absolute;
    top: var(--space-2);
    right: var(--space-2);
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: var(--color-bg);
    color: var(--color-text);
    font-size: var(--text-lg);
    line-height: 1;
}

.create-blog__thumb-remove:focus-visible {
    outline: var(--focus-ring);
    outline-offset: 2px;
}

/* Preview mode */
.create-blog__preview {
    padding-bottom: var(--section-space);
}

.create-blog__preview-cover {
    margin-bottom: var(--space-block);
}

.create-blog__preview-cover img {
    width: 100%;
    max-height: 28rem;
    border-radius: var(--radius-md);
    object-fit: cover;
}

.create-blog__preview-measure {
    max-width: 42rem;
    margin-inline: auto;
}

.create-blog__preview-title {
    font-family: var(--font-serif);
    font-size: var(--text-display);
    font-weight: var(--weight-regular);
    line-height: var(--leading-display);
}

.create-blog__preview-meta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-1) var(--space-3);
    margin-top: var(--space-5);
    color: var(--color-text-muted);
    font-size: var(--text-ui);
}

.create-blog__preview-meta > * + *::before {
    content: '·';
    margin-right: var(--space-3);
}

.create-blog__preview-lead {
    margin-top: var(--space-6);
    color: var(--color-text-muted);
    font-family: var(--font-serif);
    font-size: var(--text-lead);
    font-style: italic;
}

.prose {
    margin-top: var(--space-8);
}

.prose :deep(h1),
.prose :deep(h2),
.prose :deep(h3) {
    margin-top: var(--space-8);
    margin-bottom: var(--space-3);
    font-family: var(--font-serif);
    font-weight: var(--weight-regular);
    line-height: var(--leading-snug);
}

.prose :deep(p) {
    margin-bottom: var(--space-5);
    line-height: var(--leading-body);
}

.prose :deep(a) {
    color: var(--color-accent);
    text-decoration: underline;
}

.prose :deep(img) {
    width: 100% !important;
    height: auto !important;
    border-radius: var(--radius-md);
}

.create-blog__login {
    padding-block: var(--section-space);
}
</style>
