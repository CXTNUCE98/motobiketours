<script setup>
import { ref, computed } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'
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
const { t } = useI18n()
const queryClient = useQueryClient()

const showReplyForm = ref(false)
const replyContent = ref('')

// Thời gian tương đối (vừa xong, N phút/giờ/ngày trước)
const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return t('comment.justNow')
    if (minutes < 60) return t('comment.minutesAgo', { count: minutes })
    if (hours < 24) return t('comment.hoursAgo', { count: hours })
    if (days < 7) return t('comment.daysAgo', { count: days })
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
    onError: () => {
        ElNotification({
            title: t('comment.errorTitle'),
            message: t('comment.replyError'),
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
            title: t('comment.errorTitle'),
            message: t('comment.deleteError'),
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
            title: t('comment.errorTitle'),
            message: t('comment.likeLoginRequired'),
            type: 'error',
        })
        return
    }
    likeMutation.mutate({ commentId: props.comment.id, type: 'like' })
}

const handleDislike = () => {
    if (!user.value) {
        ElNotification({
            title: t('comment.errorTitle'),
            message: t('comment.dislikeLoginRequired'),
            type: 'error',
        })
        return
    }
    likeMutation.mutate({ commentId: props.comment.id, type: 'dislike' })
}

const handleDelete = () => {
    if (confirm(t('comment.confirmDelete'))) {
        deleteMutation.mutate(props.comment.id)
    }
}

const isOwnComment = computed(() => {
    return user.value && props.comment.author.authId === user.value.id
})
</script>

<template>
    <div class="comment-item">
        <img :src="comment?.author?.avatar" :alt="comment?.author?.userName" class="comment-item__avatar">

        <div class="comment-item__body">
            <p class="comment-item__head">
                <span class="comment-item__author">{{ comment?.author?.userName }}</span>
                <span aria-hidden="true">·</span>
                <span class="comment-item__date">{{ formatDate(comment?.createdAt) }}</span>
            </p>

            <p class="comment-item__content">{{ comment?.content }}</p>

            <div class="comment-item__actions">
                <button type="button" class="comment-item__action" :disabled="likeMutation.isPending.value"
                    @click="handleLike">
                    {{ t('comment.like') }}<span v-if="comment?.likeCount"> ({{ comment.likeCount }})</span>
                </button>
                <button type="button" class="comment-item__action" :disabled="likeMutation.isPending.value"
                    @click="handleDislike">
                    {{ t('comment.dislike') }}<span v-if="comment?.dislikeCount"> ({{ comment.dislikeCount }})</span>
                </button>
                <UiButton v-if="user" variant="ghost" size="sm" @click="showReplyForm = !showReplyForm">
                    {{ t('comment.reply') }}
                </UiButton>
                <button v-if="isOwnComment" type="button" class="comment-item__action comment-item__action--danger"
                    :disabled="deleteMutation?.isPending?.value" @click="handleDelete">
                    {{ t('comment.delete') }}
                </button>
            </div>

            <form v-if="showReplyForm" class="comment-item__reply-form" @submit.prevent="handleReply">
                <label class="visually-hidden" :for="`reply-${comment.id}`">{{ t('comment.replyPlaceholder') }}</label>
                <textarea :id="`reply-${comment.id}`" v-model="replyContent" class="ui-control" rows="3"
                    :placeholder="t('comment.replyPlaceholder')" required></textarea>
                <div class="comment-item__reply-actions">
                    <UiButton type="submit" size="sm" :disabled="createReplyMutation?.isPending?.value || !replyContent.trim()">
                        {{ createReplyMutation?.isPending?.value ? t('comment.posting') : t('comment.postReply') }}
                    </UiButton>
                    <UiButton type="button" variant="ghost" size="sm" @click="showReplyForm = false">
                        {{ t('comment.cancel') }}
                    </UiButton>
                </div>
            </form>

            <div v-if="comment?.replies && comment?.replies?.length > 0" class="comment-item__replies">
                <CommentItem v-for="reply in comment?.replies" :key="reply.id" :comment="reply"
                    :current-user="currentUser" :blog-id="blogId" @refresh="emit('refresh')" />
            </div>

            <div v-if="comment?.replyCount > 5 && (!comment?.replies || comment?.replies?.length < comment?.replyCount)"
                class="comment-item__load-more">
                <button type="button">
                    {{ t('comment.loadMoreReplies', { count: comment?.replyCount - (comment?.replies?.length || 0) }) }}
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.comment-item {
    display: flex;
    gap: var(--space-4);
    padding-block: var(--space-5);
    border-bottom: 1px solid var(--color-border);
}

.comment-item__avatar {
    flex-shrink: 0;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 50%;
    object-fit: cover;
    background: var(--color-bg-subtle);
}

.comment-item__body {
    flex: 1;
    min-width: 0;
}

.comment-item__head {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: var(--space-2);
    color: var(--color-text-muted);
    font-size: var(--text-sm);
}

.comment-item__author {
    color: var(--color-text);
    font-weight: var(--weight-semibold);
}

.comment-item__content {
    margin-top: var(--space-2);
    color: var(--color-text);
    line-height: var(--leading-body);
}

.comment-item__actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-4);
    margin-top: var(--space-3);
}

.comment-item__action {
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    transition: color var(--transition-base);
}

.comment-item__action:hover:not(:disabled) {
    color: var(--color-accent);
}

.comment-item__action--danger:hover:not(:disabled) {
    color: var(--color-danger);
}

.comment-item__action:focus-visible,
.comment-item__load-more button:focus-visible {
    outline: var(--focus-ring);
    outline-offset: 2px;
}

.comment-item__reply-form {
    margin-top: var(--space-4);
}

.comment-item__reply-actions {
    display: flex;
    gap: var(--space-3);
    margin-top: var(--space-3);
}

.comment-item__replies {
    margin-top: var(--space-4);
    padding-left: var(--space-5);
    border-left: 1px solid var(--color-border);
}

.comment-item__load-more {
    margin-top: var(--space-3);
}

.comment-item__load-more button {
    color: var(--color-accent);
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    text-decoration: underline;
    text-underline-offset: 0.25em;
}
</style>
