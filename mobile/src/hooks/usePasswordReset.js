import { useMutation } from '@tanstack/react-query'
import { apiFetch } from '../utils/apiClient'

export function useForgotPassword () {
  return useMutation({
    mutationFn: ({ email }) =>
      apiFetch('/auth/forgot-password', { method: 'POST', body: { email } })
  })
}

export function useVerifyResetCode () {
  return useMutation({
    mutationFn: ({ email, code }) =>
      apiFetch('/auth/verify-reset-code', { method: 'POST', body: { email, code } })
  })
}

export function useResetPassword () {
  return useMutation({
    mutationFn: ({ resetToken, password }) =>
      apiFetch('/auth/reset-password', { method: 'POST', body: { resetToken, password } })
  })
}
