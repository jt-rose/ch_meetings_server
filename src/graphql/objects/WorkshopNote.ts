import { ObjectType, Field, Int } from 'type-graphql'

@ObjectType()
export class WorkshopNote {
  @Field(() => Int)
  note_id: number

  @Field(() => Int)
  workshop_id: number

  @Field()
  note: string
}