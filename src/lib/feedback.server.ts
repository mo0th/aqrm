import { ApiUser, FeedbackType } from '~/types'
import type { Feedback } from '~/lib/db/types'
import { z } from 'zod'
import { ApiError } from './error.server'
import { getSiteByName } from './sites.server'
import { db } from './db/client'

export const feedbackBodySchema = z.object({
  site: z.string().min(3),
  text: z
    .string()
    .min(1)
    .transform(s => s.trim()),
  userId: z.string().optional(),
  type: z.nativeEnum(FeedbackType),
})

export type CreateFeedbackInput = {
  text: string
  userId?: string
  type: FeedbackType
}

export const createFeedback = async (
  siteName: string,
  { text, type, userId }: CreateFeedbackInput
): Promise<void> => {
  try {
    const site = await getSiteByName(siteName)

    if (!site?.allowFeedback) return

    await db.insert(db.$schema.feedback).values({
      text,
      type,
      userId,
      siteId: site.id,
    })
  } catch (err) {
    console.error(err)
  }
}

export const getFeedbackForSite = async (
  user: ApiUser | null,
  siteName: string
): Promise<Feedback[]> => {
  const site = await getSiteByName(siteName)

  console.log({ site, siteName, user })

  if (!site) {
    throw new ApiError(404, 'Site not found')
  }

  if (site.ownerId !== user?.id && !site.isPublic) {
    throw new ApiError(403, 'This site is private')
  }

  return db.query.feedback.findMany({
    where: (f, c) => c.eq(f.siteId, site.id),
    orderBy: (f, o) => o.desc(f.createdAt),
  })
}

export const getFeedbackForUser = async (user: ApiUser): Promise<Feedback[]> => {
  const siteIds = db
    .select({
      id: db.$schema.site.id,
    })
    .from(db.$schema.site)
    .where(db.$cmp.eq(db.$schema.site.ownerId, user.id))

  return db.query.feedback.findMany({
    where: (f, c) => c.inArray(f.siteId, siteIds),
    orderBy: (f, o) => o.desc(f.createdAt),
  })
}

export const deleteFeedback = async (user: ApiUser, feedbackId: string): Promise<void> => {
  const feedback = await db.query.feedback.findFirst({
    where: (f, c) => c.eq(f.id, feedbackId),
    with: {
      site: {
        columns: {
          ownerId: true,
        },
      },
    },
  })

  if (!feedback) {
    throw new ApiError(404, 'Feedback not found')
  }

  if (feedback.site.ownerId != user.id) {
    throw new ApiError(403, "You don't own the site for this feedback")
  }

  await db.delete(db.$schema.feedback).where(db.$cmp.eq(db.$schema.feedback.id, feedbackId))
}
