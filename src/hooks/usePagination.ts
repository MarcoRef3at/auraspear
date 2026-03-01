'use client'

import { useState, useMemo, useCallback } from 'react'

interface UsePaginationOptions {
  initialPage?: number
  initialLimit?: number
}

interface UsePaginationReturn {
  page: number
  setPage: (page: number) => void
  limit: number
  setLimit: (limit: number) => void
  total: number
  setTotal: (total: number) => void
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export function usePagination(options?: UsePaginationOptions): UsePaginationReturn {
  const [page, setPage] = useState(options?.initialPage ?? 1)
  const [limit, setLimit] = useState(options?.initialLimit ?? 10)
  const [total, setTotal] = useState(0)

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit])

  const hasNext = useMemo(() => page < totalPages, [page, totalPages])
  const hasPrev = useMemo(() => page > 1, [page])

  const handleSetLimit = useCallback((newLimit: number) => {
    setLimit(newLimit)
    setPage(1)
  }, [])

  return {
    page,
    setPage,
    limit,
    setLimit: handleSetLimit,
    total,
    setTotal,
    totalPages,
    hasNext,
    hasPrev,
  }
}
