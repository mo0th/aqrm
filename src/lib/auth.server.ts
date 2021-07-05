import type { User } from 'next-auth'
import crypto from 'crypto'
import { prisma } from './prisma.server'
import { hash, compare } from 'bcryptjs'
import { ApiError } from 'next/dist/next-server/server/api-utils'

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
    throw new ApiError(406, 'User already exists')
  }

  const passwordHash = await hashPassword(password)

  await prisma.user.create({
    data: { email, passwordHash, name, picture: createGravatarUrl(email) },
  })
}
