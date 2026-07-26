import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authFetch } from '../utils/authFetch'

export const PRODUCTS_KEY = ['products']

// The API rejects prices with more than 2 decimals, and form inputs hand us
// strings — normalize both here so no caller has to remember.
function toPrice (value) {
  return Math.round((Number(value) || 0) * 100) / 100
}

function toQuantity (value) {
  return Math.trunc(Number(value) || 0)
}

function toBody ({ name, price, quantity, categoryId }) {
  return {
    name,
    price: toPrice(price),
    quantity: toQuantity(quantity),
    // Absent means "leave it alone", null means "uncategorize".
    categoryId: categoryId || null
  }
}

export default function useProducts () {
  return useQuery({
    queryKey: PRODUCTS_KEY,
    queryFn: () => authFetch('/products')
  })
}

export function useSaveProduct () {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (product) =>
      authFetch('/products', { method: 'POST', body: toBody(product) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY })
  })
}

export function useUpdateProduct () {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...product }) =>
      authFetch(`/products/${id}`, { method: 'PATCH', body: toBody(product) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY })
  })
}

export function useRestockProduct () {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, quantity }) =>
      authFetch(`/products/${id}`, {
        method: 'PATCH',
        body: { quantity: toQuantity(quantity) }
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY })
  })
}

export function useDeleteProduct () {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => authFetch(`/products/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY })
  })
}

/**
 * Registers a sale by decrementing each sold product's stock.
 *
 * There is no /sales endpoint yet, so this is a client-side loop of PATCHes:
 * it is NOT atomic — a failure partway through leaves earlier products already
 * decremented. Replace with a single server-side transaction once the sales
 * endpoint exists.
 */
export function useRegisterSale () {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (items) =>
      Promise.all(
        items.map(({ id, quantity }) =>
          authFetch(`/products/${id}`, {
            method: 'PATCH',
            body: { quantity: toQuantity(quantity) }
          })
        )
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY })
  })
}
