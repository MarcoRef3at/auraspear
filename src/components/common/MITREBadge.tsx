import { Shield } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface MITREBadgeProps {
  techniqueId: string
}

export function MITREBadge({ techniqueId }: MITREBadgeProps) {
  return (
    <Badge variant="outline" className="gap-1 font-mono text-xs">
      <Shield className="h-3 w-3" />
      {techniqueId}
    </Badge>
  )
}
