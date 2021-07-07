import { createApiHandler } from '@/lib/api.server'
import { getSession } from 'next-auth/client'
import { getUserByIdWithoutPassword } from '../../../lib/auth.server'

export default createApiHandler(async (req, res) => {
  if (req.method === 'GET') {
    const session = await getSession({ req })

    const userId = (session?.user as any)?.id

    if (!userId) return res.json({ user: null })

    const user = await getUserByIdWithoutPassword(userId)

    res.json({ user })
  }
})
