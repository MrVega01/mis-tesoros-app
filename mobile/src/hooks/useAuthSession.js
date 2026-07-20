import * as SecureStore from 'expo-secure-store'
import useAuthStore from '../stores/authStore'
import { apiFetch, ApiError } from '../utils/apiClient'
import { STATUS, ACCESS_KEY, REFRESH_KEY } from '../utils/authConstants'
import { refreshTokens } from '../utils/authUtils'

export default function useAuthSession () {
  const setAccessToken = useAuthStore(state => state.setAccessToken)
  const setRefreshToken = useAuthStore(state => state.setRefreshToken)
  const setUser = useAuthStore(state => state.setUser)
  const setStatus = useAuthStore(state => state.setStatus)
  const clearState = useAuthStore(state => state.clearState)

  const setSession = async ({ accessToken, refreshToken, user }) => {
    try {
      if (accessToken) await SecureStore.setItemAsync(ACCESS_KEY, accessToken)
      if (refreshToken) await SecureStore.setItemAsync(REFRESH_KEY, refreshToken)
    } catch {}
    if (accessToken) setAccessToken(accessToken)
    if (refreshToken) setRefreshToken(refreshToken)
    if (user) setUser(user)
    setStatus(STATUS.AUTHENTICATED)
  }

  const clearSession = async () => {
    try {
      await SecureStore.deleteItemAsync(ACCESS_KEY)
      await SecureStore.deleteItemAsync(REFRESH_KEY)
    } catch {}
    clearState()
  }

  const restoreSession = async () => {
    try {
      const stored = await SecureStore.getItemAsync(REFRESH_KEY)
      if (!stored) { setStatus(STATUS.UNAUTHENTICATED); return }
      useAuthStore.getState().setRefreshToken(stored)
      await refreshTokens()
      try {
        const { accessToken } = useAuthStore.getState()
        const me = await apiFetch('/user/me', { token: accessToken })
        if (me?.id && me?.email) useAuthStore.getState().setUser(me)
      } catch {}
    } catch (err) {
      if (err instanceof ApiError && err.status === 0) {
        setStatus(STATUS.UNAUTHENTICATED)
      }
    }
  }

  return { setSession, clearSession, restoreSession }
}
