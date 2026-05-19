import { useState, useEffect, useCallback } from 'react'
import type { Lead, LeadFilters, PaginationMeta } from '@/types'
import * as leadsApi from '@/api/leads.api'

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFiltersState] = useState<LeadFilters>({
    page: 1,
    limit: 10,
    sort: 'latest',
  })

  const fetchLeads = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await leadsApi.getLeads(filters)
      setLeads(res.data ?? [])
      setMeta(res.meta ?? null)
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch leads'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  const setFilters = useCallback(
    (partial: Partial<LeadFilters>) => {
      setFiltersState((prev) => {
        const shouldResetPage = !(
          Object.keys(partial).length === 1 && 'page' in partial
        )
        return {
          ...prev,
          ...partial,
          ...(shouldResetPage ? { page: 1 } : {}),
        }
      })
    },
    [],
  )

  const handlePageChange = useCallback((page: number) => {
    setFiltersState((prev) => ({ ...prev, page }))
  }, [])

  return {
    leads,
    meta,
    isLoading,
    error,
    filters,
    setFilters,
    handlePageChange,
    refetch: fetchLeads,
  }
}