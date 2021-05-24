import Redis from 'ioredis'

console.log(process.env.REDIS_HOST)
export const redis = new Redis({
  // overrides local host when in testing env
  // REDIS_HOST env variable will be provided directly by docker
  host: process.env.REDIS_HOST || 'localhost',
  // default port of 6379 used for local host and docker testing env
  port: 6379,
})
