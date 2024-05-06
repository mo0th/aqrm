import { createBrowserClient as createBrowserClientSB } from '@supabase/ssr'
import { env } from '~/env'

export function createBrowserClient() {
  return createBrowserClientSB(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}
