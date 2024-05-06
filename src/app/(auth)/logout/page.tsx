import { redirect } from 'next/navigation'
import { createServerClient } from '~/lib/supabase/server'

export default async function LogoutPage() {
  const supabase = createServerClient()
  await supabase.auth.signOut()
  redirect('/')
}
