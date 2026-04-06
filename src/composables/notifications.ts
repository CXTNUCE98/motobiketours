export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface NotificationItem {
  id: number
  type: NotificationType
  message: string
  timeoutMs: number
}

// Track active timeouts for proper cleanup
const activeTimeouts = new Map<number, ReturnType<typeof setTimeout>>()

export function useNotifications() {
  const items = useState<NotificationItem[]>('notifications', () => [])
  const seed = useState<number>('notifications-seed', () => 1)

  const remove = (id: number) => {
    // Clear pending timeout for this notification
    const tid = activeTimeouts.get(id)
    if (tid) {
      clearTimeout(tid)
      activeTimeouts.delete(id)
    }
    const idx = items.value.findIndex(n => n.id === id)
    if (idx >= 0) items.value.splice(idx, 1)
  }

  const notify = (type: NotificationType, message: string, timeoutMs = 3500) => {
    // Skip during SSR
    if (process.server) return

    const id = ++seed.value
    const item: NotificationItem = { id, type, message, timeoutMs }
    items.value.push(item)
    if (timeoutMs > 0) {
      const tid = setTimeout(() => {
        activeTimeouts.delete(id)
        remove(id)
      }, timeoutMs)
      activeTimeouts.set(id, tid)
    }
  }

  return { items, notify, remove }
}


