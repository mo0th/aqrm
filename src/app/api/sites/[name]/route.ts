import { getCurrentUser } from '~/lib/auth.server'
import { deleteSite, editSite, editSiteBodySchema, getSiteByName } from '~/lib/sites.server'

export async function GET(_req: Request, props: { params: { name: string } }) {
  const user = await getCurrentUser()
  const siteName = props.params.name

  if (!siteName) return Response.json({ site: null, loggedIn: false })

  const site = await getSiteByName(siteName)

  const canViewSite = site?.isPublic || (user && site?.ownerId === user.id)

  return Response.json({ site: canViewSite ? site : null })
}

export async function DELETE(_req: Request, props: { params: { name: string } }) {
  const user = await getCurrentUser()
  const siteName = props.params.name

  if (!siteName || !user) return Response.json({ success: false })

  await deleteSite(user, siteName)
  return Response.json({ success: true })
}

export async function PATCH(req: Request, props: { params: { name: string } }) {
  const user = await getCurrentUser()
  const siteName = props.params.name

  if (!siteName || !user) return Response.json({ success: false })

  const updates = await editSiteBodySchema.parseAsync(req.body)
  await editSite(user, siteName, updates)
  return Response.json({ success: true })
}
