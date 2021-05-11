import { ObjectType, Field, Int } from 'type-graphql'

@ObjectType()
export class Client {
  @Field(() => Int)
  client_id: number

  @Field()
  client_name: string

  @Field(() => String, { nullable: true })
  business_unit: string

  //workshops: Workshop[] -> field resolver
}
