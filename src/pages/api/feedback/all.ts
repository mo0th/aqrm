import { createApiHandler } from '~/lib/api.server'
import { getUserFromRequestOrThrow } from '~/lib/auth.server'
import { getFeedbackForUser } from '~/lib/feedback.server'

export default createApiHandler(async (req, res) => {
  const user = await getUserFromRequestOrThrow(req)

  if (req.method === 'GET') {
    res.json(await getFeedbackForUser(user))
  }
})
