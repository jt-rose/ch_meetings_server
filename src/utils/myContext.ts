import { Request, Response } from 'express'
import { Redis } from 'ioredis'
import { Session } from 'express-session'

export type MyContext = {
  req: Request & { session: IGetUserIDSession }
  res: Response
  redis: Redis
}

interface IGetUserIDSession extends Session {
  userId?: number
}
