<script setup>
import { ref, computed } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useAuth } from '~/composables/useAuth'
import { logger } from '~/utils/logger'

const props = defineProps({
    comment: {
        type: Object,
        required: true
    },
    currentUser: {
        type: Object,
        default: null
    },
    blogId: {
        type: String,
        required: true
    }
})

const emit = defineEmits(['refresh'])

const { user } = useAuth()
const queryClient = useQueryClient()

const showReplyForm = ref(false)
const replyContent = ref('')

// Format date
const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Create reply mutation
const createReplyMutation = useMutation({
    mutationFn: (replyData) => $motobikertoursApi('/comments', {
        method: 'POST',
        body: replyData
    }),
    onSuccess: () => {
        replyContent.value = ''
        showReplyForm.value = false
        emit('refresh')
    },
    onError: (error) => {
        ElNotification({
            title: 'Error',
            message: 'Failed to post reply. Please try again.',
            type: 'error',
        })
    }
})

// Like mutation
const likeMutation = useMutation({
    mutationFn: ({ commentId, type }) => $motobikertoursApi(`/comments/${commentId}/like`, {
        method: 'POST',
        body: {
            userId: user.value.id,
            type
        }
    }),
    onSuccess: () => {
        emit('refresh')
    }
})

// Delete mutation
const deleteMutation = useMutation({
    mutationFn: (commentId) => $motobikertoursApi(`/comments/${commentId}`, {
        method: 'DELETE',
        query: {
            userId: user.value.id
        }
    }),
    onSuccess: () => {
        emit('refresh')
    },
    onError: (error) => {
        logger.error('Error deleting comment:', error)
        ElNotification({
            title: 'Error',
            message: 'Failed to delete comment. You can only delete your own comments.',
            type: 'error',
        })
    }
})

const handleReply = () => {
    if (!user.value || !replyContent.value.trim()) return

    createReplyMutation.mutate({
        blogId: props.blogId,
        content: replyContent.value,
        author: {
            authId: user.value.id,
            avatar: user.value.avatar || `https://ui-avatars.com/api/?name=${user.value.userName}`,
            userName: user.value.userName
        },
        parentId: props.comment.id
    })
}

const handleLike = () => {
    if (!user.value) {
        ElNotification({
            title: 'Error',
            message: 'Please login to like comments',
            type: 'error',
        })
        return
    }
    likeMutation.mutate({ commentId: props.comment.id, type: 'like' })
}

const handleDislike = () => {
    if (!user.value) {
        ElNotification({
            title: 'Error',
            message: 'Please login to dislike comments',
            type: 'error',
        })
        return
    }
    likeMutation.mutate({ commentId: props.comment.id, type: 'dislike' })
}

const handleDelete = () => {
    if (confirm('Are you sure you want to delete this comment?')) {
        deleteMutation.mutate(props.comment.id)
    }
}

const isOwnComment = computed(() => {
    return user.value && props.comment.author.authId === user.value.id
})
</script>

<template>
    <div class="comment-item">
        <div class="flex gap-4">
            <!-- Avatar -->
            <NuxtImg :src="comment?.author?.avatar" :alt="comment?.author?.userName"
                class="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-gray-200 dark:border-gray-600" />

            <div class="flex-1">
                <!-- Header -->
                <div class="flex items-center gap-2 mb-2">
                    <span class="font-bold text-gray-800 dark:text-white">{{ comment?.author?.userName }}</span>
                    <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(comment?.created_at) }}</span>
                </div>
                <!-- Content -->
                <p class="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">{{ comment?.content }}</p>

                <!-- Actions -->
                <div class="flex items-center gap-4 text-sm">
                    <button @click="handleLike" :disabled="likeMutation.isPending.value"
                        class="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                        <i class='bx bx-like'></i>
                        <span>{{ comment?.likeCount }}</span>
                    </button>

                    <button @click="handleDislike" :disabled="likeMutation.isPending.value"
                        class="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                        <i class='bx bx-dislike'></i>
                        <span>{{ comment?.dislikeCount }}</span>
                    </button>

                    <button v-if="user" @click="showReplyForm = !showReplyForm"
                        class="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                        <i class='bx bx-reply'></i>
                        <span>Reply</span>
                    </button>

                    <button v-if="isOwnComment" @click="handleDelete" :disabled="deleteMutation?.isPending?.value"
                        class="flex items-center gap-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 transition-colors">
                        <i class='bx bx-trash'></i>
                        <span>Delete</span>
                    </button>
                </div>

                <!-- Reply Form -->
                <div v-if="showReplyForm" class="mt-4">
                    <textarea v-model="replyContent" placeholder="Write a reply..." rows="3"
                        class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-500/20 transition-all text-gray-900 dark:text-white placeholder-gray-400 text-sm"
                        required></textarea>
                    <div class="flex gap-2 mt-2">
                        <button @click="handleReply"
                            :disabled="createReplyMutation?.isPending?.value || !replyContent.trim()"
                            class="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            {{ createReplyMutation?.isPending?.value ? 'Posting...' : 'Post Reply' }}
                        </button>
                        <button @click="showReplyForm = false"
                            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                            Cancel
                        </button>
                    </div>
                </div>

                <!-- Nested Replies -->
                <div v-if="comment?.replies && comment?.replies?.length > 0"
                    class="mt-6 space-y-6 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                    <CommentItem v-for="reply in comment?.replies" :key="reply.id" :comment="reply"
                        :current-user="currentUser" :blog-id="blogId" @refresh="emit('refresh')" />
                </div>

                <!-- Load more replies -->
                <div v-if="comment?.replyCount > 5 && (!comment?.replies || comment?.replies?.length < comment?.replyCount)"
                    class="mt-4">
                    <button
                        class="text-sm text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 font-medium">
                        Load {{ comment?.replyCount - (comment?.replies?.length || 0) }} more replies
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.comment-item {
    @apply py-4;
}
</style>
