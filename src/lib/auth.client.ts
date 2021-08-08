import type { ApiUser } from '@/types'
import { signout, signin } from 'next-auth/client'
import { useRouter } from 'next/router'
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

export const useLogin = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation<void, string, { email: string; password: string }>(
    async vars => {
      const response = await signin('credentials', { ...vars, redirect: false })

      if (response?.error) {
        throw response?.error
      }
    },
    {
      onSuccess: () => {
        queryClient.clear()
        router.push('/sites')
      },
    }
  )
}

export const useLogout = () => {
  const queryClient = useQueryClient()

  return useMutation<undefined, null>(
    () => signout({ callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/logged-out` }),
    {
      onSuccess: () => {
        queryClient.clear()
      },
    }
  )
}

export const useMe = () => {
  return useQuery<{ user: ApiUser | null }>('me', {
    queryFn: () => api('/api/auth/me'),
  })
}
