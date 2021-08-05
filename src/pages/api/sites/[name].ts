import { createApiHandler } from '@/lib/api.server'
import { getUserFromRequest, userGuard } from '@/lib/auth.server'
import { ApiError } from '@/lib/error.server'
import { deleteSite, editSite, editSiteBodySchema, getSiteByName } from '@/lib/sites.server'

export default createApiHandler(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')

  const siteName = req.query.name

  if (typeof siteName !== 'string') {
    throw new ApiError(404, 'Site not found')
  }

  let user = await getUserFromRequest(req)

  if (req.method === 'GET') {
    const site = await getSiteByName(siteName)

    if (!site) {
      throw new ApiError(404, 'Site not found')
    }

    const canViewSite = site.isPublic || (user && site.ownerId === user.id)

    if (!canViewSite) {
      throw new ApiError(403, "This site belongs to someone else and isn't public")
    }

    res.json(site)

    // Return to prevent error response if not logged in
    return
  }

  user = userGuard(user)

  if (req.method === 'DELETE') {
    await deleteSite(user, siteName)
    res.json({ success: true })
  } else if (req.method === 'PATCH') {
    const updates = await editSiteBodySchema.parseAsync(req.body)
    res.json(await editSite(user, siteName, updates))
  }
})
