import { createApiHandler } from '~/lib/api.server'
import { getUserFromRequestOrThrow } from '~/lib/auth.server'
import { createSite, createSiteBodySchema, getSitesByUser } from '~/lib/sites.server'

export default createApiHandler(async (req, res) => {
  const user = await getUserFromRequestOrThrow(req)

  if (req.method === 'GET') {
    const sites = await getSitesByUser(user)
    res.json(sites)
  } else if (req.method === 'POST') {
    const { name } = await createSiteBodySchema.parseAsync(req.body)
    const newSite = await createSite(user, name)
    res.json(newSite)
  }
})
