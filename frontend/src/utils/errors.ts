import axios from 'axios'
import type { ApiError } from '../types/error'

export function getApiErrorMessage(error: unknown, fallback: string): string | null {
  if (!error) return null
  if (axios.isAxiosError<ApiError>(error) && error.response?.data.message) {
    return error.response.data.message
  }
  return fallback
}
