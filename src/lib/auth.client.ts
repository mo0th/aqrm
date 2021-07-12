import type { ApiUser } from '@/types'
import { signout } from 'next-auth/client'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { api } from './api.client'

type TSignupInput = { name: string; email: string; password: string }

export const useSignup = () => {
  const queryClient = useQueryClient()

  return useMutation<{ success: true }, { issues: Partial<TSignupInput> }, TSignupInput>(
    vars => api('/api/auth/signup', { method: 'POST', data: vars }),
    {
      onSuccess: () => {
        queryClient.clear()
      },
    }
  )
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
