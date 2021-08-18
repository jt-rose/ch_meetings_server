import { ObjectType, Field, Int } from 'type-graphql'
import { Workshop } from './Workshop'

@ObjectType()
export class WorkshopGroup {
  @Field(() => Int)
  group_id: number

  @Field()
  group_name: string

  @Field(() => Int)
  created_by: number

  /* ----------------------------- field resolvers ---------------------------- */

  @Field(() => [Workshop])
  workshops: Workshop[]

  @Field(() => [WorkshopGroupNote])
  group_notes: WorkshopGroupNote[]
}

@ObjectType()
export class WorkshopGroupNote {
  @Field(() => Int)
  note_id: number

  @Field(() => Int)
  created_by: number

  @Field()
  created_at: Date

  @Field(() => Int)
  group_id: number

  @Field()
  note: string
}
