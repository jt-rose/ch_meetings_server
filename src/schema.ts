import { makeSchema, objectType } from 'nexus'
import { join } from 'path'
import * as types from './graphql/index'

export const schema = makeSchema({
  types: [types],
  outputs: {
    typegen: join(__dirname, '..', 'nexus-typegen.ts'),
    schema: join(__dirname, '..', 'schema.graphql'),
  },
})
