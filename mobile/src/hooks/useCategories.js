import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authFetch } from '../utils/authFetch'
import { PRODUCTS_KEY } from './useProducts'

export const CATEGORIES_KEY = ['categories']

export default function useCategories () {
  return useQuery({
    queryKey: CATEGORIES_KEY,
    queryFn: () => authFetch('/categories')
  })
}

export function useSaveCategory () {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (name) =>
      authFetch('/categories', { method: 'POST', body: { name } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY })
  })
}

export function useUpdateCategory () {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, name }) =>
      authFetch(`/categories/${id}`, { method: 'PATCH', body: { name } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY })
      // Products embed the category name, so a rename makes them stale too.
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY })
    }
  })
}

export function useDeleteCategory () {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => authFetch(`/categories/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY })
      // Deleting a category uncategorizes its products server-side.
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY })
    }
  })
}
