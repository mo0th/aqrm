import { createBrowserClient as createBrowserClientSB } from '@supabase/ssr'

export function createBrowserClient() {
  return createBrowserClientSB(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
