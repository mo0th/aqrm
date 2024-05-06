import type { ApiRequestError } from '~/types'
import type { Site } from '~/lib/db/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './api.client'

export const useSites = () => {
  return useQuery<Site[]>({
    queryKey: ['sites'],
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
  >({
    mutationFn: vars => api('/api/sites', { data: vars }),
    onSuccess: data => {
      queryClient.setQueryData(['sites'], (existing: Site[] | undefined) =>
        existing ? [...existing, data] : [data]
      )
      queryClient.setQueryData(['sites', data.name], data)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] })
    },
  })
}

export const useSite = (siteName?: string) => {
  return useQuery<{ site: Site }, ApiRequestError>({
    queryKey: ['sites', siteName],
    queryFn: () => api(`/api/sites/${siteName}`),
    enabled: typeof siteName === 'string',
  })
}

export const useDeleteSite = (siteName: string) => {
  const queryClient = useQueryClient()
  return useMutation<{ success: true }, ApiRequestError, void, void>({
    mutationFn: () => api(`/api/sites/${siteName}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.setQueryData<Site[]>(['sites'], existing =>
        existing ? existing.filter(s => s.name !== siteName) : []
      )
      queryClient.setQueryData(['sites', siteName], null)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] })
    },
  })
}

export const useEditSite = (siteName: string) => {
  const queryClient = useQueryClient()
  return useMutation<Site, ApiRequestError, Partial<Pick<Site, 'isPublic' | 'allowFeedback'>>>({
    mutationFn: vars => api(`/api/sites/${siteName}`, { method: 'PATCH', data: vars }),
    onMutate: vars => {
      queryClient.setQueryData<Site>(['sites', siteName], site => ({ ...site, ...vars }) as any)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['sites', siteName] })
    },
  })
}
