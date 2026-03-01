import type { AxiosError } from 'axios'

interface ApiErrorResponse {
  messageKey?: string
  message?: string
}

export function getErrorKey(error: unknown): string {
  const axiosError = error as AxiosError<ApiErrorResponse>
  const data = axiosError?.response?.data
  if (data?.messageKey) {
    return data.messageKey
  }
  if (data?.message) {
    return data.message
  }
  if (axiosError?.message) {
    return axiosError.message
  }
  return 'errors.common.unknown'
}
