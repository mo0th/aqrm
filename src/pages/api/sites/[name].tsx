import { createApiHandler } from '@/lib/api.server'
import { getUserFromRequest, getUserFromRequestOrThrow } from '@/lib/auth.server'
import { ApiError } from '@/lib/error.server'
import { deleteSite, getSiteByName } from '@/lib/sites.server'

export default createApiHandler(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')

  if (typeof req.query.name !== 'string') {
    throw new ApiError(404, 'Site not found')
  }

  if (req.method === 'GET') {
    const user = await getUserFromRequest(req)
    const site = await getSiteByName(req.query.name)

    if (!site) {
      throw new ApiError(404, 'Site not found')
    }

    const canViewSite = site.isPublic || (user && site.ownerId === user.id)

    if (!canViewSite) {
      throw new ApiError(403, "This site belongs to someone else and isn't public")
    }

    res.json(site)
  } else if (req.method === 'DELETE') {
    const user = await getUserFromRequestOrThrow(req)
    await deleteSite(user, req.query.name)
    res.json({ success: true })
  }
})
