import type { ApiRequestError } from '~/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './api.client'
import { Feedback } from './db/types'

export const useSiteFeedback = (siteName: string) => {
  return useQuery<Feedback[], ApiRequestError>({
    queryKey: ['feedback', siteName],
    queryFn: () => api(`/api/sites/${siteName}/feedback`),
  })
}

export const useDeleteFeedback = (siteName: string) => {
  const queryClient = useQueryClient()
  return useMutation<{ success: true }, ApiRequestError, { id: string }>({
    mutationFn: ({ id }) => api(`/api/feedback/${id}`, { method: 'DELETE' }),
    onSuccess: (_data, { id }) => {
      queryClient.setQueryData<Feedback[]>(['feedback', siteName], existing =>
        existing ? existing.filter(f => f.id !== id) : []
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback', siteName] })
    },
  })
}
