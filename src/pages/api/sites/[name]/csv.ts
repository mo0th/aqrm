import { createApiHandler } from '@/lib/api.server'
import { getUserFromRequest } from '@/lib/auth.server'
import { ApiError } from '@/lib/error.server'
import { getFeedbackForSite } from '@/lib/feedback.server'

export default createApiHandler(async (req, res) => {
  if (typeof req.query.name !== 'string') {
    throw new ApiError(404, 'Site not found')
  }

  const user = await getUserFromRequest(req)

  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'application/csv')

    res.write('type,text,userId,createdAt\n')

    const feedback = await getFeedbackForSite(user, req.query.name)

    for (const { type, text, userId, createdAt } of feedback) {
      res.write([type, text, userId, createdAt].map(i => JSON.stringify(i)).join(',') + '\n')
    }

    res.end()
  }
})
