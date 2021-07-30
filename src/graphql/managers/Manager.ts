import { ObjectType, Field, Int } from 'type-graphql'
import { Client } from '../clients/Client'
import { Workshop } from '../workshops/Workshop'
import { USER_TYPE } from '../enums/USER_TYPE'

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

  @Field(() => USER_TYPE)
  user_type: USER_TYPE

  @Field()
  active: boolean

  // field resolvers
  @Field(() => [Client])
  active_clients: Client[]

  @Field(() => [Workshop])
  active_workshops: Workshop[]
}
