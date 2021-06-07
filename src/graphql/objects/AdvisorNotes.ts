import { ObjectType, Field, Int } from 'type-graphql'

ObjectType()
export class AdvisorNote {
  @Field(() => Int)
  note_id: number

  @Field(() => Int)
  advisor_id: number

  @Field()
  advisor_note: string
}
