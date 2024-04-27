import { createApiHandler } from '~/lib/api.server'
import { getUserByIdWithoutPassword } from '../../../lib/auth.server'
import { createPagesServerClient } from '~/lib/supabase/pages-server'

export default createApiHandler(async (req, res) => {
  if (req.method === 'GET') {
    const supabase = createPagesServerClient(req, res)
    const userId = (await supabase.auth.getUser()).data.user?.id

    if (!userId) return res.json({ user: null, loggedIn: false })

    const user = await getUserByIdWithoutPassword(userId)

    res.json({ user, loggedIn: true })
  }
})
