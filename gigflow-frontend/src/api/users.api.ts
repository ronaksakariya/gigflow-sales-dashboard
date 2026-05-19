import type { ApiResponse, User } from '@/types'
import axiosInstance from '@/api/axios'

export async function getAllUsers(): Promise<ApiResponse<User[]>> {
  const response = await axiosInstance.get<ApiResponse<User[]>>('/users')
  return response.data
}

export async function updateUserRole(
  id: string,
  role: 'admin' | 'sales',
): Promise<ApiResponse<User>> {
  const response = await axiosInstance.patch<ApiResponse<User>>(
    `/users/${id}/role`,
    { role },
  )
  return response.data
}