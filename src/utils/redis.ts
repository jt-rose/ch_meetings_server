import Redis from 'ioredis'

const host = process.env.REDIS_HOST || 'localhost'
console.log('redis host:', host)
export const redis = new Redis({
  // overrides local host when in testing env
  // REDIS_HOST env variable will be provided directly by docker
  host,
  // default port of 6379 used for local host and docker testing env
  port: 6379,
})
