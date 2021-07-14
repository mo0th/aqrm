import { createApiHandler } from '@/lib/api.server'
import { createFeedback, feedbackBodySchema } from '@/lib/feedback.server'

export default createApiHandler(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  try {
    if (req.method === 'POST') {
      const validationResult = await feedbackBodySchema.safeParseAsync(req.body)

      if (!validationResult.success) {
        res.end()
        return
      }

      const { site: siteName, ...feedbackData } = validationResult.data

      await createFeedback(siteName, feedbackData)
    }
  } finally {
    res.end()
  }
})
