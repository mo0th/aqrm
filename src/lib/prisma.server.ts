import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient
const globalAny: any = global

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!globalAny.prisma) {
    globalAny.prisma = new PrismaClient()
  }
  prisma = globalAny.prisma
}

export default prisma

export { prisma }
export type { Site, Feedback, User, UserRole } from '@prisma/client'
export { FeedbackType } from '@prisma/client'
