import { ObjectType, Field, Int } from 'type-graphql'

// workshop templates that will autopopulate sessions
// and other info based on selected course
@ObjectType()
export class WorkshopSessionSet {
  @Field(() => Int)
  session_set_id: number

  @Field(() => Int)
  course_id: number

  @Field()
  session_name: string

  @Field(() => Int)
  session_order: number
}
