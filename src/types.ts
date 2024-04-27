import { Doc } from './lib/db/types'

export type ApiUser = Omit<Doc<'user'>, 'passwordHash'>

export type ApiRequestError = { message: 'string' }

export enum FeedbackType {
  ISSUE = 'ISSUE',
  IDEA = 'IDEA',
  OTHER = 'OTHER',
}
