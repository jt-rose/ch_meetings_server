import { ObjectType, Field } from 'type-graphql'

@ObjectType()
export class Advisor {
  @Field()
  email: string

  @Field()
  first_name: string

  @Field()
  last_name: string
}
