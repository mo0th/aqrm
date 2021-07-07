import type { ApiUser } from '@/types'
import { signout } from 'next-auth/client'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { api } from './api.client'

export const useSignup = () => {
  const queryClient = useQueryClient()

  return useMutation<
    { success: true },
    { issues: Record<string, string> },
    { name: string; email: string; password: string }
  >(vars => api('/api/auth/signup', { method: 'POST', data: vars }), {
    onSuccess: () => {
      queryClient.clear()
    },
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()

  return useMutation<undefined, null>(() => signout({ callbackUrl: '/logged-out' }), {
    onSuccess: () => {
      queryClient.clear()
    },
  })
}

export const useMe = () => {
  return useQuery<{ user: ApiUser | null }>('me', {
    queryFn: () => api('/api/auth/me'),
  })
}
