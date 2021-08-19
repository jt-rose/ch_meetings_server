import { ObjectType, Field, Int } from 'type-graphql'
import { Workshop } from './Workshop'

@ObjectType()
export class WorkshopGroup {
  @Field(() => Int)
  group_id: number

  @Field()
  group_name: string

  @Field({ nullable: true })
  group_description?: string

  @Field(() => Int)
  created_by: number

  /* ----------------------------- field resolvers ---------------------------- */

  @Field(() => [Workshop])
  workshops: Workshop[]
}
