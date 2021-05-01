import 'reflect-metadata'
import express from 'express'
import { createConnection } from 'typeorm'
import path from 'path'
import { buildSchema } from 'type-graphql'
import { ApolloServer } from 'apollo-server-express'
import { redis } from './utils/redis'
import { MyContext } from './utils/myContext'
import {
  getComplexity,
  fieldExtensionsEstimator,
  simpleEstimator,
} from 'graphql-query-complexity'

/* ----------------------------- import entities ---------------------------- */

import { Advisor } from './entities/ADVISOR'
import { User } from './entities/USER'
import { Client } from './entities/CLIENT'
import { Session } from './entities/SESSION'
import { Workshop } from './entities/WORKSHOP'

/* ---------------------------- import resolvers ---------------------------- */

import { AdvisorResolver } from './resolvers/advisor'
//import {} from './resolvers/user'
//import {} from './resolvers/client'
//import {} from './resolvers/session'
//import {} from './resolvers/workshop'

/* --------------------------- init main function --------------------------- */

require('dotenv').config()

const main = async () => {
  /* ------------------------- connect to TypeORM DB ------------------------ */

  const conn = await createConnection({
    type: 'postgres',
    database: 'ahab',
    username: 'postgres',
    password: process.env.LOCAL_PASSWORD,
    port: 8000,
    logging: true,
    //synchronize: true, disable in prod 12:16
    entities: [Advisor, User, Client, Session, Workshop],
    migrations: [path.join(__dirname, './migrations/*')],
  })

  await conn.runMigrations()

  /* --------------------------- initialize express --------------------------- */

  const app = express()

  /* ---------------------------- initalize apollo ---------------------------- */

  const schema = await buildSchema({
    resolvers: [AdvisorResolver],
    validate: false,
    // automatically create `schema.gql` file with schema definition in project's working directory
    emitSchemaFile: true,
  })
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }): MyContext => ({
      req,
      res,
      redis,
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
}

/* ------------------------------- launch app ------------------------------- */

main().catch((err) => {
  console.log(err)
})
