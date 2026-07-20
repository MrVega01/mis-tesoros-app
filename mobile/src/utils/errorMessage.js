import { ApiError } from './apiClient'

export function resolveErrorMessage (error, t, statusMessages = {}) {
  if (!error) return null
  if (error instanceof ApiError && statusMessages[error.status]) {
    return t(statusMessages[error.status])
  }
  if (error instanceof ApiError && error.status === 0) return t('common.errors.network')
  return t('common.errors.unknown')
}
