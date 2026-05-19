export type Role = 'admin' | 'sales'
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost'
export type LeadSource = 'Website' | 'Instagram' | 'Referral'

export interface User {
  _id: string
  name: string
  email: string
  role: Role
}

export interface Lead {
  _id: string
  name: string
  email: string
  status: LeadStatus
  source: LeadSource
  createdBy: string | User
  createdAt: string
  updatedAt: string
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
  meta?: PaginationMeta
}

export interface LeadFilters {
  status?: LeadStatus | ''
  source?: LeadSource | ''
  search?: string
  sort?: 'latest' | 'oldest'
  page?: number
  limit?: number
}