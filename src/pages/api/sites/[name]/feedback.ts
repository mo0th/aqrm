import { createApiHandler } from '@/lib/api.server'
import { getUserFromRequestOrThrow } from '@/lib/auth.server'
import { ApiError } from '@/lib/error.server'
import { getFeedbackForSite } from '@/lib/feedback.server'

export default createApiHandler(async (req, res) => {
  const user = await getUserFromRequestOrThrow(req)

  if (typeof req.query.name !== 'string') {
    throw new ApiError(404, 'Site not found')
  }

  if (req.method === 'GET') {
    res.json(await getFeedbackForSite(user, req.query.name))
  }
})
