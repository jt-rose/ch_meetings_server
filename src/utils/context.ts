import { Request, Response } from 'express'
import { Redis } from 'ioredis'
import { Session } from 'express-session'
import { PrismaClient } from '@prisma/client'

export type Context = {
  req: Request & { session: IGetUserIDSession }
  res: Response
  redis: Redis
  prisma: PrismaClient
}

interface IGetUserIDSession extends Session {
  manager_id?: number
}
