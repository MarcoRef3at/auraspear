'use client'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { TIME_RANGES } from '@/lib/constants'

interface TimeRangeSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={val => {
        if (val) {
          onChange(val)
        }
      }}
      variant="outline"
      size="sm"
    >
      {TIME_RANGES.map(range => (
        <ToggleGroupItem key={range.value} value={range.value}>
          {range.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
