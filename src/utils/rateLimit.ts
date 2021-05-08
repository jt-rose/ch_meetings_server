import { MiddlewareFn } from 'type-graphql'
import { Context } from '../utils/context'
import { redis } from './redis'

const ONE_DAY = 60 * 60 * 24
const standardLimit = 500

type RateLimit = (limit?: number) => MiddlewareFn<Context>
export const rateLimit: RateLimit = (limit = standardLimit) => async (
  { context: { req } /*, info */ },
  next
) => {
  // for now, a simple daily user rate limit is sufficient
  // if we need to rate limit specific queries
  // we can use the following commented out code
  //const key = `rate-limit:${info.fieldName}:${req.ip}`
  const key = `rate-limit:${req.ip}`

  const current = await redis.incr(key)
  console.log(key, ' is at ', current)
  if (current > limit) {
    throw new Error(
      `You have exceeded the daily rate limit of ${limit} to the server. Please wait until the following day.`
    )
  } else if (current === 1) {
    console.log('expired')
    await redis.expire(key, ONE_DAY)
  }

  return next()
}
