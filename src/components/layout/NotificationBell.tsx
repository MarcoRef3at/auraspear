'use client'

import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNotificationStore } from '@/stores'

export function NotificationBell() {
  const { unreadCount } = useNotificationStore()

  return (
    <Button variant="ghost" size="icon" className="relative">
      <Bell className="h-4 w-4 text-muted-foreground" />
      {unreadCount > 0 && (
        <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive" />
        </span>
      )}
    </Button>
  )
}
