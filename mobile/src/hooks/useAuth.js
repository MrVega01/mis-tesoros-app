import { useMutation } from '@tanstack/react-query'
import { apiFetch } from '../utils/apiClient'
import { authFetch } from '../utils/authFetch'
import useAuthStore from '../stores/authStore'
import useAuthSession from './useAuthSession'

export function useRegister () {
  const { setSession } = useAuthSession()
  return useMutation({
    mutationFn: ({ email, password, role }) =>
      apiFetch('/auth/register', { method: 'POST', body: { email, password, role } }),
    onSuccess: async (data) => {
      if (data.accessToken) {
        await setSession({ accessToken: data.accessToken, refreshToken: data.refreshToken, user: data.user })
      }
    }
  })
}

export function useLogin () {
  const { setSession } = useAuthSession()
  return useMutation({
    mutationFn: ({ email, password }) =>
      apiFetch('/auth/login', { method: 'POST', body: { email, password } }),
    onSuccess: async (data) => {
      await setSession({ accessToken: data.accessToken, refreshToken: data.refreshToken, user: data.user })
    }
  })
}

export function useVerifyEmail () {
  const { setSession } = useAuthSession()
  return useMutation({
    mutationFn: ({ email, code }) =>
      apiFetch('/auth/verify-email', { method: 'POST', body: { email, code } }),
    onSuccess: async (data) => {
      await setSession({ accessToken: data.accessToken, refreshToken: data.refreshToken, user: data.user })
    }
  })
}

export function useResendCode () {
  return useMutation({
    mutationFn: ({ email, type }) =>
      apiFetch('/auth/resend-code', { method: 'POST', body: { email, type } })
  })
}

export function useLogout () {
  const { clearSession } = useAuthSession()
  return useMutation({
    mutationFn: () => {
      const { refreshToken } = useAuthStore.getState()
      return authFetch('/auth/logout', { method: 'POST', body: { refreshToken } })
    },
    onSettled: async () => {
      await clearSession()
    }
  })
}
