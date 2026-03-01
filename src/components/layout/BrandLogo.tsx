'use client'

import { Shield } from 'lucide-react'

interface BrandLogoProps {
  collapsed?: boolean
}

export function BrandLogo({ collapsed }: BrandLogoProps) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
        <Shield className="h-4.5 w-4.5 text-primary-foreground" />
      </div>
      {!collapsed && (
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight text-foreground">AuraSpear</span>
          <span className="text-[10px] font-medium text-muted-foreground">SOC Platform</span>
        </div>
      )}
    </div>
  )
}
