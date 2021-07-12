import type { User } from '@prisma/client'

export type ApiUser = Omit<User, 'passwordHash'>

export type ApiRequestError = { message: 'string' }

export enum FeedbackType {
  ISSUE = 'ISSUE',
  IDEA = 'IDEA',
  OTHER = 'OTHER',
}
