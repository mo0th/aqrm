import type { Site } from '~/lib/db/types'
import type { ApiUser } from '~/types'

import { z, ZodError } from 'zod'

import { ApiError } from './error.server'
import { db } from './db/client'

export const getSitesByUser = async (user: ApiUser): Promise<Site[]> => {
  return db.query.site.findMany({
    where: (f, c) => c.eq(f.ownerId, user.id),
    orderBy: (f, o) => o.asc(f.name),
  })
}

export const getSiteByName = (name: string): Promise<Site | undefined> => {
  return db.query.site.findFirst({ where: (f, c) => c.eq(f.name, name) })
}

export const createSiteBodySchema = z.object({
  name: z.string().min(3, { message: 'Site name must be 3 or more characters long' }),
})

export const createSite = async (user: ApiUser, name: string): Promise<Site> => {
  const existing = await getSiteByName(name)

  if (existing) {
    throw new ZodError([
      { path: ['name'], message: `Site ${JSON.stringify(name)} already exists`, code: 'custom' },
    ])
  }

  const result = await db.insert(db.$schema.site).values({ name, ownerId: user.id }).returning()
  return result[0]
}

export const deleteSite = async (user: ApiUser, name: string): Promise<void> => {
  const site = await getSiteByName(name)

  if (!site) {
    throw new ApiError(404, 'Site not found')
  }

  if (site.ownerId !== user.id) {
    throw new ApiError(403, 'This site belongs to another user')
  }

  await db.transaction(async t => {
    await Promise.all([
      t.delete(db.$schema.feedback).where(db.$cmp.eq(db.$schema.feedback.siteId, site.id)),
      t.delete(db.$schema.site).where(db.$cmp.eq(db.$schema.site.id, site.id)),
    ])
  })
}

export const editSiteBodySchema = z
  .object({
    allowFeedback: z.boolean(),
    isPublic: z.boolean(),
  })
  .partial()

export const editSite = async (
  user: ApiUser,
  name: string,
  updates: z.infer<typeof editSiteBodySchema>
): Promise<Site> => {
  const site = await getSiteByName(name)
  // const site = await prisma.site.findUnique({ where: { name } })

  if (!site) {
    throw new ApiError(404, 'Site not found')
  }

  if (site.ownerId !== user.id) {
    throw new ApiError(403, "You don't own this site, so you can't make changes")
  }

  const [updated] = await db
    .update(db.$schema.site)
    .set(updates)
    .where(db.$cmp.eq(db.$schema.site.id, site.id))
    .returning()
  return updated
}
