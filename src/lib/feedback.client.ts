import type { ApiRequestError } from '@/types'
import type { Feedback } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { api } from './api.client'

export const useSiteFeedback = (siteName: string) => {
  return useQuery<Feedback[], ApiRequestError>(['feedback', siteName], {
    queryFn: () => api(`/api/sites/${siteName}/feedback`),
  })
}

export const useDeleteFeedback = (siteName: string) => {
  const queryClient = useQueryClient()
  return useMutation<{ success: true }, ApiRequestError, { id: string }>(
    ({ id }) => api(`/api/feedback/${id}`, { method: 'DELETE' }),
    {
      onSuccess: (_data, { id }) => {
        queryClient.setQueryData<Feedback[]>(['feedback', siteName], existing =>
          existing ? existing.filter(f => f.id !== id) : []
        )
      },
      onSettled: () => {
        queryClient.invalidateQueries(['feedback', siteName])
      },
    }
  )
}
