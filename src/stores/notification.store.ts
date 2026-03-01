import { create } from 'zustand'
import type { NotificationType } from '@/enums'

interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: string
  read: boolean
}

interface NotificationState {
  items: Notification[]
  unreadCount: number
  addNotification: (notification: Notification) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  items: [],
  unreadCount: 0,
  addNotification: (notification) =>
    set(state => ({
      items: [notification, ...state.items],
      unreadCount: state.unreadCount + 1,
    })),
  markAsRead: (id) =>
    set(state => ({
      items: state.items.map(item => (item.id === id ? { ...item, read: true } : item)),
      unreadCount: Math.max(0, get().unreadCount - 1),
    })),
  markAllAsRead: () =>
    set(state => ({
      items: state.items.map(item => ({ ...item, read: true })),
      unreadCount: 0,
    })),
}))
