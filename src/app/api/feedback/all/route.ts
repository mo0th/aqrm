import { requireCurrentUser } from '~/lib/auth.server'
import { getFeedbackForUser } from '~/lib/feedback.server'

export async function GET() {
  const user = await requireCurrentUser()

  return Response.json(await getFeedbackForUser(user))
}
