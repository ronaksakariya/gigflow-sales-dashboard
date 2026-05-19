import type { ApiResponse, Lead, LeadFilters } from '@/types'
import axiosInstance from '@/api/axios'

export async function getLeads(
  filters: LeadFilters,
): Promise<ApiResponse<Lead[]>> {
  const params = new URLSearchParams()
  if (filters.status) params.set('status', filters.status)
  if (filters.source) params.set('source', filters.source)
  if (filters.search) params.set('search', filters.search)
  if (filters.sort) params.set('sort', filters.sort)
  if (filters.page) params.set('page', String(filters.page))
  if (filters.limit) params.set('limit', String(filters.limit))

  const response = await axiosInstance.get<ApiResponse<Lead[]>>(
    `/leads?${params.toString()}`,
  )
  return response.data
}

export async function getLeadById(
  id: string,
): Promise<ApiResponse<Lead>> {
  const response = await axiosInstance.get<ApiResponse<Lead>>(`/leads/${id}`)
  return response.data
}

export async function createLead(data: {
  name: string
  email: string
  status: Lead['status']
  source: Lead['source']
}): Promise<ApiResponse<Lead>> {
  const response = await axiosInstance.post<ApiResponse<Lead>>(
    '/leads',
    data,
  )
  return response.data
}

export async function updateLead(
  id: string,
  data: Partial<{
    name: string
    email: string
    status: Lead['status']
    source: Lead['source']
  }>,
): Promise<ApiResponse<Lead>> {
  const response = await axiosInstance.put<ApiResponse<Lead>>(
    `/leads/${id}`,
    data,
  )
  return response.data
}

export async function deleteLead(id: string): Promise<ApiResponse<null>> {
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/leads/${id}`,
  )
  return response.data
}

export function exportLeads(
  filters: Omit<LeadFilters, 'page' | 'limit'>,
): void {
  const params = new URLSearchParams()
  if (filters.status) params.set('status', filters.status)
  if (filters.source) params.set('source', filters.source)
  if (filters.search) params.set('search', filters.search)
  if (filters.sort) params.set('sort', filters.sort)

  const url = `${import.meta.env.VITE_API_URL}/leads/export?${params.toString()}`
  window.open(url, '_blank')
}