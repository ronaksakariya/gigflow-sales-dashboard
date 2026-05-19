import type { ApiResponse, User } from '@/types'
import type { Role } from '@/types'
import axiosInstance from '@/api/axios'

export async function register(data: {
  name: string
  email: string
  password: string
  role?: Role
}): Promise<ApiResponse<User>> {
  const response = await axiosInstance.post<ApiResponse<User>>(
    '/auth/register',
    data,
  )
  return response.data
}

export async function login(data: {
  email: string
  password: string
}): Promise<ApiResponse<User>> {
  const response = await axiosInstance.post<ApiResponse<User>>(
    '/auth/login',
    data,
  )
  return response.data
}

export async function logout(): Promise<ApiResponse<null>> {
  const response = await axiosInstance.post<ApiResponse<null>>('/auth/logout')
  return response.data
}

export async function getMe(): Promise<ApiResponse<User>> {
  const response = await axiosInstance.get<ApiResponse<User>>('/auth/me')
  return response.data
}