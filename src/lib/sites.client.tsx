import type { Site } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { api } from './api.client'

export const useSites = () => {
  return useQuery<Site[]>('sites', {
    queryFn: () => api('/api/sites'),
  })
}

type CreateSiteInput = { name: string }

export const useCreateSite = () => {
  const queryClient = useQueryClient()
  return useMutation<
    Site,
    { issues: Partial<CreateSiteInput> },
    CreateSiteInput,
    { prevSites?: Site[] }
  >(vars => api('/api/sites', { data: vars }), {
    onSuccess: data => {
      queryClient.setQueryData('sites', (existing: Site[] | undefined) =>
        existing ? [...existing, data] : [data]
      )
      queryClient.setQueryData(['sites', data.name], data)
    },
    onSettled: () => {
      queryClient.invalidateQueries('sites')
    },
  })
}

export const useSite = (siteName?: string) => {
  return useQuery<Site, { message: string }>(['sites', siteName], {
    queryFn: () => api(`/api/sites/${siteName}`),
    enabled: typeof siteName === 'string',
  })
}

export const useDeleteSite = (siteName: string) => {
  const queryClient = useQueryClient()
  return useMutation<{ success: true }, { message: string }, void, void>(
    () => api(`/api/sites/${siteName}`, { method: 'DELETE' }),
    {
      onSuccess: () => {
        queryClient.setQueryData('sites', (existing: Site[] | undefined) =>
          existing ? existing.filter(s => s.name !== siteName) : []
        )
        queryClient.setQueryData(['sites', siteName], null)
      },
      onSettled: () => {
        queryClient.invalidateQueries('sites')
      },
    }
  )
}
