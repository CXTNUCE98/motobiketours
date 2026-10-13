<script setup lang="ts">
import { useNotifications } from '@/composables/notifications'

const { t } = useI18n()
const { items, remove } = useNotifications()
</script>

<template>
  <div class="toast-stack" role="status" aria-live="polite">
    <div v-for="n in items" :key="n.id" class="toast" :class="`toast--${n.type}`">
      <p class="toast__message">{{ n.message }}</p>
      <button type="button" class="toast__close" :aria-label="t('common.close')" @click="remove(n.id)">×</button>
    </div>
  </div>
</template>

<style scoped>
.toast-stack {
  position: fixed;
  top: var(--space-4);
  right: var(--space-4);
  z-index: 1000;
  display: grid;
  gap: var(--space-3);
  width: clamp(16rem, 90vw, 22rem);
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border);
  border-left: 3px solid var(--color-accent);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  box-shadow: var(--shadow-popover);
}

.toast--success {
  border-left-color: var(--color-success);
}

.toast--error {
  border-left-color: var(--color-danger);
}

.toast--warning {
  border-left-color: var(--color-warning);
}

.toast--info {
  border-left-color: var(--color-accent);
}

.toast__message {
  flex: 1 1 auto;
  color: var(--color-text);
  font-size: var(--text-sm);
  line-height: var(--leading-snug);
}

.toast__close {
  flex-shrink: 0;
  color: var(--color-text-muted);
  font-size: var(--text-lg);
  line-height: 1;
}

.toast__close:hover {
  color: var(--color-text);
}

.toast__close:focus-visible {
  outline: var(--focus-ring);
  outline-offset: 2px;
}
</style>
