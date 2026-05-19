import { Response } from 'express';
import { PaginationMeta, ApiResponse } from '../types';

export function sendSuccess<T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
  meta?: PaginationMeta
): void {
  const response: ApiResponse<T> = {
    success: true,
    message,
    ...(data !== undefined && { data }),
    ...(meta !== undefined && { meta }),
  };
  res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  statusCode: number,
  message: string,
  errors?: Record<string, string>
): void {
  const response: ApiResponse<never> = {
    success: false,
    message,
    ...(errors !== undefined && { errors }),
  };
  res.status(statusCode).json(response);
}