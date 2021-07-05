import { PrismaClient } from '@prisma/client'

let _prisma: PrismaClient

const getPrisma = () => {
  if (!_prisma) {
    _prisma = new PrismaClient()
  }
  return _prisma
}

export const prisma = getPrisma()
