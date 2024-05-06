import { requireCurrentUser } from '~/lib/auth.server'
import { createSite, createSiteBodySchema, getSitesByUser } from '~/lib/sites.server'

export async function GET() {
  const user = await requireCurrentUser()

  const sites = await getSitesByUser(user)
  return Response.json(sites)
}

export async function POST(request: Request) {
  const user = await requireCurrentUser()

  const { name } = await createSiteBodySchema.parseAsync(await request.json())
  const newSite = await createSite(user, name)
  return Response.json(newSite)
}
