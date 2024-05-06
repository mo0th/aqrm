import { requireCurrentUser } from '~/lib/auth.server'
import { deleteFeedback } from '~/lib/feedback.server'

export async function DELETE(_req: Request, props: { params: { id: string } }) {
  const id = props.params.id
  const user = await requireCurrentUser()
  await deleteFeedback(user, id)
  return Response.json({ success: true })
}
