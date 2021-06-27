import { ObjectType, Field, Int } from 'type-graphql'

@ObjectType()
export class SessionNote {
  @Field(() => Int)
  note_id: number

  @Field(() => Int)
  workshop_session_id: number

  @Field()
  note: string

  @Field(() => Date)
  date_of_note: Date
}
