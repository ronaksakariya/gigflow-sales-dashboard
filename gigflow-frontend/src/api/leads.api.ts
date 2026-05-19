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

export async function exportLeads(
  filters: Omit<LeadFilters, 'page' | 'limit'>,
): Promise<void> {
  const params = new URLSearchParams()
  if (filters.status) params.set('status', filters.status)
  if (filters.source) params.set('source', filters.source)
  if (filters.search) params.set('search', filters.search)
  if (filters.sort) params.set('sort', filters.sort)

  const response = await axiosInstance.get('/leads/export?' + params.toString(), {
    responseType: 'blob',
  })

  const blob = new Blob([response.data], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'gigflow-leads.csv'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}