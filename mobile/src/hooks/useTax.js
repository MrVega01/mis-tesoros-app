import { useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useTaxStore from '../stores/taxStore'
import { authFetch } from '../utils/authFetch'
import useAuthState from './useAuthState'
import useAuthSession from './useAuthSession'

// Read selector (granular, like useAuthState).
export function useTaxRate () {
  return useTaxStore(state => state.tax)
}

// Action + persistence. Side effects live in the hook, not the store, so the
// store stays pure state. The rate is a seller setting on the server now, so
// "persisting" it is a request rather than a write to the device.
export function useTaxActions () {
  const queryClient = useQueryClient()
  const setTax = useTaxStore(state => state.setTax)
  const { user } = useAuthState()
  const { setSession } = useAuthSession()

  const mutation = useMutation({
    mutationFn: (customTaxRate) =>
      authFetch('/user/tax-rate', { method: 'PATCH', body: { customTaxRate } }),
    onSuccess: (data) => {
      setSession({ user: { ...user, profile: data.profile } })
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] })
    }
  })

  // Number() is the single coercion point. The store updates first so the
  // input stays responsive, then rolls back if the save fails — otherwise the
  // screen would keep showing a rate the server never recorded.
  const updateTax = async (value) => {
    const tax = Number(value) || 0
    const previous = useTaxStore.getState().tax
    setTax(tax)
    try {
      await mutation.mutateAsync(tax)
    } catch (error) {
      setTax(previous)
      throw error
    }
  }

  return { updateTax, isPending: mutation.isPending, error: mutation.error }
}

// Seeds the store from the seller's saved rate, which already arrives with the
// session user via /user/me. Customers have no seller profile, so their rate
// stays 0. Replaces the old one-shot AsyncStorage read.
export function useTaxSync () {
  const setTax = useTaxStore(state => state.setTax)
  const { user } = useAuthState()
  const customTaxRate = user?.profile?.customTaxRate

  useEffect(() => {
    setTax(Number(customTaxRate) || 0)
  }, [customTaxRate])
}
