import { ApiUser, FeedbackType } from '~/types'
import type { Feedback } from '~/lib/db/types'
import { z } from 'zod'
import { ApiError } from './error.server'
import { getSiteByName } from './sites.server'
import { db } from './db/client'
import { zfd } from 'zod-form-data'
import { createServerAdminClient, createServerClient } from './supabase/server'
import { createId } from '@paralleldrive/cuid2'

export const feedbackBodySchema = zfd.formData({
  site: z.string().min(3),
  text: z
    .string()
    .min(1)
    .transform(s => s.trim()),
  userId: z
    .string()
    .optional()
    .transform(s => {
      return s === 'null' ? null : s
    }),
  type: z.nativeEnum(FeedbackType),
  img: z
    .instanceof(Blob)
    .refine(arg => arg.type.startsWith('image/'))
    .optional(),
})
type FeedbackBody = z.infer<typeof feedbackBodySchema>

export type CreateFeedbackInput = Omit<FeedbackBody, 'site'>

const getImageExtension = (img: Blob) => {
  const type = img.type
  const parts = type.split('/')
  return parts[parts.length - 1]
}

export const createFeedback = async (
  siteName: string,
  { text, type, userId, img }: CreateFeedbackInput
): Promise<void> => {
  try {
    const site = await getSiteByName(siteName)

    if (!site?.allowFeedback) return

    const sb = createServerAdminClient()

    let imagePath: string | null = null

    if (img) {
      const path = `${createId()}.${getImageExtension(img)}`
      const { data, error } = await sb.storage.from('images').upload(path, img, {})

      console.log({
        path,
        data,
        error,
      })

      if (error) {
        console.log('failed to upload image', error)
      } else {
        imagePath = data.path
      }
    }

    console.log({
      text,
      type,
      userId,
      siteId: site.id,
      imagePath,
    })

    await db.insert(db.$schema.feedback).values({
      text,
      type,
      userId,
      siteId: site.id,
      imagePath,
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

  if (!site) {
    throw new ApiError(404, 'Site not found')
  }

  if (site.ownerId !== user?.id && !site.isPublic) {
    throw new ApiError(403, 'This site is private')
  }

  const feedbacks = await db.query.feedback.findMany({
    where: (f, c) => c.eq(f.siteId, site.id),
    orderBy: (f, o) => o.desc(f.createdAt),
  })

  const sb = createServerClient()

  return feedbacks.map(f => ({
    ...f,
    imageUrl: f.imagePath && sb.storage.from('images').getPublicUrl(f.imagePath).data.publicUrl,
  }))
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
