import { createApiHandler } from '@/lib/api.server'
import { getUserFromRequestOrThrow } from '@/lib/auth.server'
import { ApiError } from '@/lib/error.server'
import { deleteSite, getSiteByName } from '@/lib/sites.server'

export default createApiHandler(async (req, res) => {
  const user = await getUserFromRequestOrThrow(req)

  if (typeof req.query.name !== 'string') {
    throw new ApiError(404, 'Site not found')
  }

  if (req.method === 'GET') {
    const site = await getSiteByName(req.query.name)

    if (!site) {
      throw new ApiError(404, 'Site not found')
    }

    const canViewSite = site.isPublic || site.ownerId === user.id

    if (!canViewSite) {
      throw new ApiError(403, 'This site belongs to someone else')
    }

    res.json(site)
  } else if (req.method === 'DELETE') {
    await deleteSite(user, req.query.name)
    res.json({ success: true })
  }
})
