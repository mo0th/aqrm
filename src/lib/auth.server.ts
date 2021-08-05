import type { User } from 'next-auth'
import { hash, compare } from 'bcryptjs'
import crypto from 'crypto'
import { z, ZodError } from 'zod'

import type { ApiUser } from '@/types'
import { prisma } from './prisma.server'
import { sleep } from './utils'
import type { NextApiRequest } from 'next'
import { getSession } from 'next-auth/client'
import { ApiError } from './error.server'

const hashPassword = (password: string): Promise<string> => {
  return hash(password, 12)
}

const verifyPasswordHash = (hash: string, password: string): Promise<boolean> => {
  return compare(password, hash)
}

const createGravatarUrl = (email: string): string => {
  const hashedEmail = crypto.createHash('md5').update(email).digest('hex')

  return `https://www.gravatar.com/avatar/${hashedEmail}?d=identicon`
}

export const loginUser = async (email: string, password: string): Promise<User | null> => {
  const existingUser = await prisma.user.findUnique({ where: { email } })

  if (!existingUser) {
    return null
  }

  const isPasswordCorrect = await verifyPasswordHash(existingUser.passwordHash, password)

  if (!isPasswordCorrect) {
    await sleep(1000)
    return null
  }

  const { name, picture, id } = existingUser

  return { id, email, name, picture }
}

export const signupUser = async (name: string, email: string, password: string): Promise<void> => {
  // normalise email for gravatar
  email = email.trim().toLowerCase()

  const existingUser = await prisma.user.findUnique({ where: { email } })

  if (existingUser) {
    await sleep(1000)
    throw new ZodError([
      { path: ['email'], message: 'A user with this email already exists', code: 'custom' },
    ])
  }

  const passwordHash = await hashPassword(password)

  await prisma.user.create({
    data: { email, passwordHash, name, picture: createGravatarUrl(email) },
  })
}

export const signupBodySchema = z.object({
  email: z.string().email({ message: 'Email must be a valid email' }),
  name: z.string().min(1, { message: 'Name must be at least 1 character long' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
})

export const getUserByIdWithoutPassword = async (id: number): Promise<ApiUser | null> => {
  return prisma.user.findUnique({
    where: { id: id ?? -1 },
    select: { id: true, email: true, name: true, picture: true, role: true },
  })
}

export const getUserFromRequest = async (req: NextApiRequest): Promise<ApiUser | null> => {
  const session = await getSession({ req })
  return getUserByIdWithoutPassword((session?.user as any)?.id ?? -1)
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
