import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authFetch } from '../utils/authFetch'
import { PRODUCTS_KEY } from './useProducts'

export const SALES_KEY = ['sales']

export default function useSales () {
  return useQuery({
    queryKey: SALES_KEY,
    queryFn: () => authFetch('/sales')
  })
}

// Both mutations move stock, so the product list is stale afterwards too.
function invalidateSalesAndProducts (queryClient) {
  queryClient.invalidateQueries({ queryKey: SALES_KEY })
  queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY })
}

export function useCreateSale () {
  const queryClient = useQueryClient()
  return useMutation({
    // `items` is [{ productId, quantity }] where quantity is the amount SOLD.
    // The server does the arithmetic; the client never sends stock levels.
    mutationFn: (items) =>
      authFetch('/sales', { method: 'POST', body: { items } }),
    onSuccess: () => invalidateSalesAndProducts(queryClient)
  })
}

export function useRevertSale () {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => authFetch(`/sales/${id}/revert`, { method: 'POST' }),
    onSuccess: () => invalidateSalesAndProducts(queryClient)
  })
}
