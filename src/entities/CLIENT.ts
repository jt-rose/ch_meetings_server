import { Field, InputType, ObjectType } from 'type-graphql'
import { Workshop } from './WORKSHOP'

@ObjectType()
export class Client {
  @Field()
  client!: string

  @Field(() => [String])
  business_units!: string[]

  workshops: Workshop[]
}

// include client/ BU contacts?
@InputType()
export class ClientInput {
  @Field()
  client!: string

  @Field(() => [String])
  business_units!: string[]

  // workshops will be scheduled separately
}
