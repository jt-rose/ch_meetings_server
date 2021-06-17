import { ObjectType, Field, Int } from 'type-graphql'
import { Client } from './Client'
import { Workshop } from './Workshop'

@ObjectType()
export class Manager {
  @Field(() => Int)
  manager_id: number

  @Field()
  first_name: string

  @Field()
  last_name: string

  @Field()
  email: string

  // password field will not be exposed to graphql

  // field resolvers
  @Field(() => [Client])
  active_clients: Client[]

  @Field(() => [Workshop])
  active_workshops: Workshop[]
}
