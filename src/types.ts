import type { User } from '@prisma/client'

export type ApiUser = Omit<User, 'passwordHash'>
