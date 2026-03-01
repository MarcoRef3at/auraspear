'use client'

import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNotificationStore } from '@/stores'

export function NotificationBell() {
  const { unreadCount } = useNotificationStore()

  return (
    <Button variant="ghost" size="icon" className="relative">
      <Bell className="text-muted-foreground h-4 w-4" />
      {unreadCount > 0 && (
        <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
          <span className="bg-destructive absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
          <span className="bg-destructive relative inline-flex h-2 w-2 rounded-full" />
        </span>
      )}
    </Button>
  )
}
