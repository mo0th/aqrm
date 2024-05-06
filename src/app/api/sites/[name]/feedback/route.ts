import { requireCurrentUser } from '~/lib/auth.server'
import { getFeedbackForSite } from '~/lib/feedback.server'

export async function GET(_req: Request, props: { params: { name: string } }) {
  console.log('props', props)
  const user = await requireCurrentUser()

  return Response.json(await getFeedbackForSite(user, props.params.name))
}
