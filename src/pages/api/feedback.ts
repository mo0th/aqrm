import { createApiHandler } from '~/lib/api.server'
import { createFeedback, feedbackBodySchema } from '~/lib/feedback.server'

export default createApiHandler(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  try {
    if (req.method === 'POST') {
      if (typeof req.body === 'string') {
        try {
          req.body = JSON.parse(req.body)
        } catch (err) {
          req.body = {}
        }
      }

      const validationResult = await feedbackBodySchema.safeParseAsync(req.body)

      if (!validationResult.success) {
        res.end()
        return
      }

      const { site: siteName, ...feedbackData } = validationResult.data

      await createFeedback(siteName, feedbackData)
    }
  } catch (err) {
    console.log(err)
  } finally {
    res.end()
  }
})
