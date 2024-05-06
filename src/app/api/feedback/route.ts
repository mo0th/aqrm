import { createFeedback, feedbackBodySchema } from '~/lib/feedback.server'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    console.log('body', body)

    const validationResult = await feedbackBodySchema.safeParseAsync(body)

    console.log('validationResult', validationResult.error?.flatten())

    if (!validationResult.success) {
      return new Response(null, { status: 204 })
    }

    const { site: siteName, ...feedbackData } = validationResult.data

    console.log({
      site: siteName,
      ...feedbackData,
    })

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
