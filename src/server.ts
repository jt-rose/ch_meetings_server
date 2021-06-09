import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import session from 'express-session'
import connectRedis from 'connect-redis'
//import path from 'path'
import { buildSchema } from 'type-graphql'
import { ApolloServer } from 'apollo-server-express'
import { redis } from './utils/redis'
import { Context } from './utils/context'
import {
  getComplexity,
  fieldExtensionsEstimator,
  simpleEstimator,
} from 'graphql-query-complexity'

import { prisma } from './prisma'

/* ---------------------------- import resolvers ---------------------------- */
import { WorkshopSessionResolver } from './graphql/resolvers/SessionResolver'
import { ClientResolver } from './graphql/resolvers/ClientResolver'
import { CourseResolver } from './graphql/resolvers/CourseResolver'
import { AdvisorResolver } from './graphql/resolvers/AdvisorResolver'
import { LanguageResolver } from './graphql/resolvers/LanguageResolver'
import { RegionResolver } from './graphql/resolvers/AdvisorRegionResolver'
import { AdvisorNoteResolver } from './graphql/resolvers/AdvisorNoteResolver'

/* --------------------------- init main function --------------------------- */

require('dotenv').config()

const main = async () => {
  /* --------------------------- initialize express --------------------------- */

  const app = express()

  const RedisStore = connectRedis(session)

  //app.set('trust proxy', 1) // for use in prod with nginx
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  )

  app.use(
    session({
      name: 'qid',
      store: new RedisStore({
        client: redis as any,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production', // disable for dev in localhost
        // add domain when in prod
      },
      secret: process.env.COOKIE_SECRET as string,
      resave: false,
      saveUninitialized: false,
    })
  )

  /* ------------------------------ build schema ------------------------------ */

  const schema = await buildSchema({
    resolvers: [
      WorkshopSessionResolver,
      ClientResolver,
      CourseResolver,
      AdvisorResolver,
      LanguageResolver,
      RegionResolver,
      AdvisorNoteResolver,
    ],
    dateScalarMode: 'timestamp',
    validate: false,
    // automatically create `schema.gql` file with schema definition in project's working directory
    emitSchemaFile: true,
  })

  /* ---------------------------- initialize apollo --------------------------- */

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }): Context => ({
      req,
      res,
      redis,
      prisma,
    }),
    // plugins: [apolloLogger],
    plugins: [
      {
        requestDidStart: () => ({
          didResolveOperation({ request, document }) {
            // limit query complexity
            const complexity = getComplexity({
              schema,
              operationName: request.operationName,
              query: document,
              variables: request.variables,
              estimators: [
                // Using fieldExtensionsEstimator is mandatory to make it work with type-graphql.
                fieldExtensionsEstimator(),
                simpleEstimator({ defaultComplexity: 1 }),
              ],
            })
            if (complexity > 200) {
              console.log(
                `query rejected for having excess complexity of ${complexity}`
              )
              throw new Error(
                `The server has rejected this request for having too great a complexity. Please revise as a more limited number of queries.`
              )
            }
            // And here we can e.g. subtract the complexity point from hourly API calls limit.
          },
        }),
      },
    ],
    // context
  })

  apolloServer.applyMiddleware({ app })

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
