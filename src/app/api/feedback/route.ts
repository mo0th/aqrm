import { createFeedback, feedbackBodySchema } from '~/lib/feedback.server'

export async function POST(request: Request) {
  try {
    const body = await request.formData()

    const validationResult = await feedbackBodySchema.safeParseAsync(body)

    if (!validationResult.success) {
      return new Response(null, { status: 204 })
    }

    const { site: siteName, ...feedbackData } = validationResult.data

    await createFeedback(siteName, feedbackData)

    return new Response(null, { status: 204 })
  } catch (err) {
    console.log(err)
  }
}

export async function OPTIONS(_request: Request) {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
  })
}
