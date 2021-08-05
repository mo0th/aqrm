import type { Site } from '@prisma/client'
import type { ApiUser } from '@/types'

import { z, ZodError } from 'zod'

import { prisma } from '@/lib/prisma.server'
import { ApiError } from './error.server'

export const getSitesByUser = async (user: ApiUser): Promise<Site[]> => {
  return prisma.site.findMany({
    where: { ownerId: user.id },
    orderBy: { name: 'asc' },
  })
}

export const getSiteByName = (name: string): Promise<Site | null> => {
  return prisma.site.findUnique({ where: { name } })
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

  return prisma.site.create({ data: { name, ownerId: user.id } })
}

export const deleteSite = async (user: ApiUser, name: string): Promise<void> => {
  const site = await getSiteByName(name)

  if (!site) {
    throw new ApiError(404, 'Site not found')
  }

  if (site.ownerId !== user.id) {
    throw new ApiError(403, 'This site belongs to another user')
  }

  await prisma.$transaction([
    prisma.feedback.deleteMany({ where: { siteId: site.id } }),
    prisma.site.delete({ where: { id: site.id } }),
  ])
}
