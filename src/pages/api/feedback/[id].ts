import { createApiHandler } from '~/lib/api.server'
import { getUserFromRequestOrThrow } from '~/lib/auth.server'
import { ApiError } from '~/lib/error.server'
import { deleteFeedback } from '~/lib/feedback.server'

export default createApiHandler(async (req, res) => {
  const user = await getUserFromRequestOrThrow(req)

  if (typeof req.query.id !== 'string') {
    throw new ApiError(404, 'Feedback not found')
  }

  if (req.method === 'DELETE') {
    await deleteFeedback(user, req.query.id)
    res.json({ success: true })
  }
})
