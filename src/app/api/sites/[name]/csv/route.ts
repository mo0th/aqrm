import { requireCurrentUser } from '~/lib/auth.server'
import { getFeedbackForSite } from '~/lib/feedback.server'

export async function GET(_req: Request, props: { params: { name: string } }) {
  const user = await requireCurrentUser()

  const feedback = await getFeedbackForSite(user, props.params.name)

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue('type,text,userId,createdAt\n')

      for (const { type, text, userId, createdAt } of feedback) {
        controller.enqueue(
          [type, text, userId, createdAt].map(i => JSON.stringify(i)).join(',') + '\n'
        )
      }

      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/csv',
    },
  })
}
