import { ObjectType, Field, Int } from 'type-graphql'
import { ClientNote } from './ClientNote'
import { License } from '../licenses/License'
import { Workshop } from '../workshops/Workshop'

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

  @Field(() => Int)
  created_by: number

  @Field(() => Date)
  created_at: Date

  /* ----------------------------- field resolvers ---------------------------- */
  @Field(() => [ClientNote])
  client_notes: ClientNote[]

  @Field(() => [License])
  licenses: License[]

  @Field(() => [Workshop])
  workshops: Workshop[]
}
