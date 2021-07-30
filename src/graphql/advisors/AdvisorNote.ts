import { ObjectType, Field, Int } from 'type-graphql'

@ObjectType()
export class AdvisorNote {
  @Field(() => Int)
  note_id: number

  @Field(() => Int)
  advisor_id: number

  @Field(() => String)
  advisor_note: string

  @Field(() => Date)
  date_of_note: Date

  @Field(() => Int)
  created_by: number

  @Field(() => Date)
  created_at: Date
}
