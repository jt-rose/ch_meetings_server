import { redis } from './utils/redis'
import { createServer } from './apollo'
import { createSchema } from './createSchema'
import { createContext } from './utils/context'

/* --------------------------- init main function --------------------------- */

require('dotenv').config()

const main = async () => {
  const schema = await createSchema()
  const { app } = createServer(schema, createContext)

  /* ------------------------------ launch server ----------------------------- */

  const port = 5000
  app.listen(port, () => console.log(`listening on port ${port}`))

  const redisConnected = await redis.ping()
  console.log('redis connected: ' + !!redisConnected)
}

/* ------------------------------- launch app ------------------------------- */

main().catch((err) => {
  console.log(err)
})
