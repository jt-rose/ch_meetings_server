import { Request, Response } from 'express'
import { Redis } from 'ioredis'
import { Session } from 'express-session'
import { PrismaClient } from '@prisma/client'

export type MyContext = {
  req: Request & { session: IGetUserIDSession }
  res: Response
  redis: Redis
  prisma: PrismaClient
}

interface IGetUserIDSession extends Session {
  userId?: number
}
