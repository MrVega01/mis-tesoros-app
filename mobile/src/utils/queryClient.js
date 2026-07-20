import { QueryClient } from '@tanstack/react-query'
import { ApiError } from './apiClient'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error instanceof ApiError && (error.status >= 500 || error.status === 0)) {
          return failureCount < 2
        }
        return false
      },
      staleTime: 60_000
    },
    mutations: {
      retry: false
    }
  }
})

export default queryClient
