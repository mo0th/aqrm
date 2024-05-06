import { getUserByIdWithoutPassword } from '~/lib/auth.server'
import { createServerClient } from '~/lib/supabase/server'

export async function GET() {
  const supabase = createServerClient()
  const userId = (await supabase.auth.getUser()).data.user?.id

  if (!userId) return Response.json({ user: null, loggedIn: false })

  const user = await getUserByIdWithoutPassword(userId)

  return Response.json({ user, loggedIn: true })
}
