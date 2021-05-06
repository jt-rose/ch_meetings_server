import { makeSchema, objectType } from 'nexus'
import { join } from 'path'

const user = objectType({
  name: 'User',
  description: 'stores user data',
  definition(t) {
    t.string('first_name')
    t.string('last_name')
    t.int('age')
    t.boolean('admin_access')
    t.list.string('aliases')
    t.string('id', {
      resolve(_root, _args, _ctx) {
        console.log('hello nexus') //_ctx.prisma.find(_args.id)
      },
    })
  },
})

export const schema = makeSchema({
  types: [user], // 1
  outputs: {
    typegen: join(__dirname, '..', 'nexus-typegen.ts'), // 2
    schema: join(__dirname, '..', 'schema.graphql'), // 3
  },
})
