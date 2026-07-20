import useAuthStore from '../stores/authStore'
import { apiFetch, ApiError } from './apiClient'
import { refreshTokens } from './authUtils'

export async function authFetch (path, options = {}) {
  const { accessToken } = useAuthStore.getState()

  try {
    return await apiFetch(path, { ...options, token: accessToken })
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      await refreshTokens()
      const { accessToken: newToken } = useAuthStore.getState()
      return apiFetch(path, { ...options, token: newToken })
    }
    throw err
  }
}
