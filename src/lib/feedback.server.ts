import { ApiUser, FeedbackType } from '@/types'
import type { Feedback } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { z } from 'zod'
import { ApiError } from './error.server'
import prisma from './prisma.server'

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
    await prisma.feedback.create({
      data: {
        text,
        type,
        userId,
        site: {
          connect: {
            name: siteName,
          },
        },
      },
    })
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      // This happens when a site doesn't exist
      if (err.code === 'P2025') {
        return
      }
    }
    console.error(err)
  }
}

const feedbackOrderBy = {
  createdAt: 'desc',
} as const

export const getFeedbackForSite = async (
  user: ApiUser | null,
  siteName: string
): Promise<Feedback[]> => {
  const siteAccessQuery = user ? [{ isPublic: true }, { ownerId: user.id }] : { isPublic: true }

  return prisma.feedback.findMany({
    where: {
      site: {
        AND: [{ name: siteName }, { OR: siteAccessQuery }],
      },
    },
    orderBy: feedbackOrderBy,
  })
}

export const getFeedbackForUser = async (user: ApiUser): Promise<Feedback[]> => {
  return prisma.feedback.findMany({
    where: {
      site: {
        ownerId: user.id,
      },
    },
    orderBy: feedbackOrderBy,
  })
}

export const deleteFeedback = async (user: ApiUser, feedbackId: string): Promise<void> => {
  const feedback = await prisma.feedback.findUnique({
    where: { id: feedbackId },
    select: {
      site: {
        select: {
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

  await prisma.feedback.delete({ where: { id: feedbackId } })
}
