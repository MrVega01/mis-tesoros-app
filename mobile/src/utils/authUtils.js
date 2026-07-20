import * as SecureStore from 'expo-secure-store'
import useAuthStore from '../stores/authStore'
import { apiFetch, ApiError } from './apiClient'
import { STATUS, ACCESS_KEY, REFRESH_KEY } from './authConstants'

// Module-level: shared across all callers. Prevents concurrent 401 retries from
// each firing their own POST /auth/refresh, which would revoke the rotated token.
let refreshPromise = null

export async function refreshTokens () {
  if (refreshPromise) return refreshPromise

  const { refreshToken } = useAuthStore.getState()
  if (!refreshToken) {
    useAuthStore.getState().clearState()
    throw new ApiError(401, 'No refresh token')
  }

  refreshPromise = apiFetch('/auth/refresh', { method: 'POST', body: { refreshToken } })
    .then(async data => {
      try {
        await SecureStore.setItemAsync(ACCESS_KEY, data.accessToken)
        await SecureStore.setItemAsync(REFRESH_KEY, data.refreshToken)
      } catch {}
      useAuthStore.getState().setAccessToken(data.accessToken)
      useAuthStore.getState().setRefreshToken(data.refreshToken)
      useAuthStore.getState().setStatus(STATUS.AUTHENTICATED)
      return data
    })
    .catch(async err => {
      if (err instanceof ApiError && err.status === 401) {
        try {
          await SecureStore.deleteItemAsync(ACCESS_KEY)
          await SecureStore.deleteItemAsync(REFRESH_KEY)
        } catch {}
        useAuthStore.getState().clearState()
      }
      throw err
    })
    .finally(() => {
      refreshPromise = null
    })

  return refreshPromise
}
