import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authFetch } from '../utils/authFetch'
import { STATUS } from '../utils/authConstants'
import useAuthState from './useAuthState'
import useAuthSession from './useAuthSession'

export function useMe () {
  const { status } = useAuthState()
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: () => authFetch('/user/me'),
    enabled: status === STATUS.AUTHENTICATED
  })
}

export function useUpdateCustomerProfile () {
  const queryClient = useQueryClient()
  const { user } = useAuthState()
  const { setSession } = useAuthSession()
  return useMutation({
    mutationFn: ({ firstName, lastName, contactNumber }) =>
      authFetch('/user/customer-profile', { method: 'PUT', body: { firstName, lastName, contactNumber } }),
    onSuccess: (data) => {
      setSession({ user: { ...user, hasProfile: true, profile: data.profile } })
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] })
    }
  })
}

export function useUpdateSellerProfile () {
  const queryClient = useQueryClient()
  const { user } = useAuthState()
  const { setSession } = useAuthSession()
  return useMutation({
    mutationFn: (body) =>
      authFetch('/user/seller-profile', { method: 'PUT', body }),
    onSuccess: (data) => {
      setSession({ user: { ...user, hasProfile: true, profile: data.profile } })
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] })
    }
  })
}
