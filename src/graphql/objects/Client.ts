import { ObjectType, Field, Int } from 'type-graphql'
import { ClientNote } from './ClientNote'
import { License } from './License'
import { Workshop } from './Workshop'

@ObjectType()
export class Client {
  @Field(() => Int)
  client_id: number

  @Field()
  client_name: string

  @Field(() => String, { nullable: true })
  business_unit: string

  @Field()
  active: boolean

  /* ----------------------------- field resolvers ---------------------------- */
  @Field(() => [ClientNote])
  client_notes: ClientNote[]

  @Field(() => [License])
  licenses: License[]

  @Field(() => [Workshop])
  workshops: Workshop[]
}
