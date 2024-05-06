import type { ApiUser } from '~/types'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './api.client'
import { createBrowserClient } from './supabase/client'

export const useSignup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (vars: { name: string; email: string }) => {
      const supabase = createBrowserClient()
      return supabase.auth.signInWithOtp({
        email: vars.email,
        options: {
          data: {
            name: vars.name,
          },
        },
      })
    },
    onSuccess: () => {
      queryClient.clear()
    },
  })
}

export const useLogin = () => {
  return useMutation({
    mutationFn: async (vars: { email: string }) => {
      const supabase = createBrowserClient()
      const response = await supabase.auth.signInWithOtp({
        email: vars.email,
      })

      console.log('response', response)

      if (response?.error) {
        throw response?.error
      }
    },
  })
}

export const useLoginPW = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async (vars: { email: string; password: string }) => {
      const supabase = createBrowserClient()
      const response = await supabase.auth.signInWithPassword({
        email: vars.email,
        password: vars.password,
      })

      if (response?.error) {
        throw response?.error
      }
    },
    onSuccess: () => {
      queryClient.clear()
      router.push('/sites')
    },
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const supabase = createBrowserClient()
      return supabase.auth.signOut()
    },
    onSuccess: () => {
      queryClient.clear()
    },
  })
}

export const useMe = () => {
  return useQuery<ApiUser | null>({
    queryKey: ['me'],
    queryFn: () => api<{ user: ApiUser | null }>('/api/auth/me').then(({ user }) => user),
  })
}
