import { ObjectType, Field, Int } from 'type-graphql'

// managers to clients many-to-many relationship
@ObjectType()
export class ManagersToClients {
  @Field(() => Int)
  manager_client_id: number

  @Field(() => Int)
  manager_id: number

  @Field(() => Int)
  client_id: number

  @Field()
  active: boolean
}
