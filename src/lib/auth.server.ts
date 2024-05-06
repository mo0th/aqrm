import { z, ZodError } from 'zod'

import type { ApiUser } from '~/types'
import { sleep } from './utils'
import type { NextApiRequest } from 'next'
import { ApiError } from './error.server'
import { db } from './db/client'
import { createPagesServerClient } from './supabase/pages-server'
import { createServerClient } from './supabase/server'

export const createUser = async (supabaseId: string, email: string): Promise<void> => {
  // normalise email for gravatar
  email = email.trim().toLowerCase()

  const existingUser = await db.query.user.findFirst({ where: (f, c) => c.eq(f.email, email) })

  if (existingUser) {
    await sleep(1000)
    throw new ZodError([
      { path: ['email'], message: 'A user with this email already exists', code: 'custom' },
    ])
  }

  await db.insert(db.$schema.user).values({ email, id: supabaseId }).onConflictDoNothing()
}

export const signupBodySchema = z.object({
  email: z.string().email({ message: 'Email must be a valid email' }),
  name: z.string().min(1, { message: 'Name must be at least 1 character long' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
})

export const getUserByIdWithoutPassword = async (id: string): Promise<ApiUser | null> => {
  const user = await db.query.user.findFirst({ where: (f, c) => c.eq(f.id, id) })
  if (!user) return null
  return user
}

export const getUserFromRequest = async (req: NextApiRequest): Promise<ApiUser | null> => {
  const supabase = createPagesServerClient(req)
  const { data: user } = await supabase.auth.getUser()
  return getUserByIdWithoutPassword(user?.user?.id ?? '')
}

export const userGuard = (user: ApiUser | null): ApiUser => {
  if (!user) {
    throw new ApiError(401, 'Please Log In')
  }

  return user
}

export const getUserFromRequestOrThrow = async (req: NextApiRequest): Promise<ApiUser> => {
  const user = await getUserFromRequest(req)

  return userGuard(user)
}

export const getCurrentUser = async () => {
  const supabase = createServerClient()
  const { data: user } = await supabase.auth.getUser()
  return getUserByIdWithoutPassword(user?.user?.id ?? '')
}

export const requireCurrentUser = async () => {
  const user = await getCurrentUser()
  if (!user) throw new ApiError(401, 'Please Log In')
  return user
}
